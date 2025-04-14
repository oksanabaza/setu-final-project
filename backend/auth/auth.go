package auth

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"fullstack-scraper/database"

	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	_, err = database.DB.Exec("INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, $3)",
		creds.Email, string(hashedPassword), time.Now())
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	token, err := GenerateJWT(creds.Email)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Signup successful", "token": token})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Decode the request body to get the email and password
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "wrong request", http.StatusBadRequest)
		return
	}

	// Log for debugging
	log.Printf("Received credentials: Email=%s, Password=%s\n", credentials.Email, credentials.Password)

	// Searching for the user in the database
	var userID int
	var storedHash string
	err := database.DB.QueryRow("SELECT user_id, password_hash FROM users WHERE email = $1", credentials.Email).Scan(&userID, &storedHash)
	if err != nil {
		// Log if there's an error querying the database
		log.Println("Error querying DB for user:", err)
		http.Error(w, "Incorrect email or password", http.StatusUnauthorized)
		return
	}

	// Log the retrieved password hash and userID for debugging
	log.Printf("User found. ID: %d, Password Hash: %s\n", userID, storedHash)

	// Checking if the passwords match
	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(credentials.Password))
	if err != nil {
		// Log if the password comparison fails
		log.Println("Password comparison failed:", err)
		http.Error(w, "Incorrect email or password", http.StatusUnauthorized)
		return
	}

	// Update the last login time in the database
	_, err = database.DB.Exec("UPDATE users SET last_login = $1 WHERE user_id = $2", time.Now(), userID)
	if err != nil {
		log.Println("Error updating last_login:", err)
		http.Error(w, "Error updating last login time", http.StatusInternalServerError)
		return
	}

	// Token generation
	token, err := GenerateJWT(credentials.Email)
	if err != nil {
		log.Println("JWT generation error:", err)
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Respond with the token and user ID
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Login is successful",
		"token":   token,
		"user_id": userID,
	})
}
