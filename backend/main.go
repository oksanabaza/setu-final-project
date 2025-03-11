package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

var jwtKey []byte
var db *sql.DB

func init() {
	// loading .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal(".env loading failed")
	}

	// reading vars from .env
	jwtKey = []byte(os.Getenv("JWT_SECRET"))
	dbURL := os.Getenv("DB_URL")

	// connecting to db
	var err error
	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("db connection failed:", err)
	}

	// Check if the connection is actually working
	if err := db.Ping(); err != nil {
		log.Fatal("DB is not reachable:", err)
	}

	log.Println("Connected to the database successfully")
}

func main() {
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL is not set in .env file")
	}

	var err error
	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("db connection failed:", err)
	}
	defer db.Close()

	// CORS settings
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// routes
	http.HandleFunc("/signup", signupHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/websites/create", authMiddleware(createWebsite))
	http.HandleFunc("/websites", authMiddleware(getWebsites))
	http.HandleFunc("/get-results", authMiddleware(getResultsHandler))

	// http.HandleFunc("/websites/create", func(w http.ResponseWriter, r *http.Request) {
	// 	if r.Method == http.MethodOptions {
	// 		w.WriteHeader(http.StatusOK)
	// 		return
	// 	}
	// 	authMiddleware(createWebsite)(w, r)
	// })

	handler := corsHandler.Handler(http.DefaultServeMux)

	log.Println("Server is running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func getWebsites(w http.ResponseWriter, r *http.Request) {
	// Query to get all websites from the database
	rows, err := db.Query("SELECT id, name, url, is_active, created_at FROM websites")
	if err != nil {
		log.Printf("Error querying websites: %v", err)
		http.Error(w, "Error querying websites", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Slice to hold all websites
	var websites []Website

	// Loop through rows and append websites to the slice
	for rows.Next() {
		var site Website
		err := rows.Scan(&site.ID, &site.Name, &site.URL, &site.IsActive, &site.CreatedAt)
		if err != nil {
			log.Printf("Error scanning website: %v", err)
			http.Error(w, "Error scanning website", http.StatusInternalServerError)
			return
		}
		websites = append(websites, site)
		println("test from oksana")
	}

	// Check for any error after iterating over rows
	if err := rows.Err(); err != nil {
		log.Printf("Error with rows: %v", err)
		http.Error(w, "Error processing rows", http.StatusInternalServerError)
		return
	}

	// Respond with the list of websites
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(websites)
}

// signup handler
func signupHandler(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "wrong request", http.StatusBadRequest)
		return
	}

	// password hashing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(credentials.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "error", http.StatusInternalServerError)
		return
	}

	// write to db
	_, err = db.Exec("INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, $3)",
		credentials.Email, string(hashedPassword), time.Now())
	if err != nil {
		http.Error(w, "error creating user", http.StatusInternalServerError)
		return
	}

	// generate token
	token, err := generateJWT(credentials.Email)
	if err != nil {
		http.Error(w, "error generating token", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "sign up is successful", "token": token})
}

// login handler
func loginHandler(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "wrong request", http.StatusBadRequest)
		return
	}

	// searhing for user in db
	var storedHash string
	err := db.QueryRow("SELECT password_hash FROM users WHERE email = $1", credentials.Email).Scan(&storedHash)
	if err != nil {
		http.Error(w, "Incorrect email or password", http.StatusUnauthorized)
		return
	}

	// checking the password
	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(credentials.Password))
	if err != nil {
		http.Error(w, "Incorrect email or password", http.StatusUnauthorized)
		return
	}

	// token generation
	token, err := generateJWT(credentials.Email)
	if err != nil {
		log.Println("JWT generation error:", err)
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Login is successful", "token": token})
}

// generation of JWT token
func generateJWT(email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

// Middleware for auth
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			http.Error(w, "token is missing", http.StatusUnauthorized)
			return
		}

		tokenStr = tokenStr[len("Bearer "):]

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			log.Println("Error validating token:", err)
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

// Adding website
//
//	func createWebsite(w http.ResponseWriter, r *http.Request) {
//		w.WriteHeader(http.StatusOK)
//		json.NewEncoder(w).Encode(map[string]string{"message": "Website has been added"})
//	}
type Website struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	URL       string    `json:"url"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

// Adding website
func createWebsite(w http.ResponseWriter, r *http.Request) {
	var site Website

	// Decode the request body into the Website struct
	if err := json.NewDecoder(r.Body).Decode(&site); err != nil {
		log.Printf("Error decoding request: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate the required fields
	if site.Name == "" || site.URL == "" {
		log.Printf("Missing name or url: Name='%v', Url='%v'", site.Name, site.URL)
		http.Error(w, "Both name and url are required", http.StatusBadRequest)
		return
	}

	// Insert the site into the database
	_, err := db.Exec("INSERT INTO websites (name, url, is_active) VALUES ($1, $2, $3)", site.Name, site.URL, site.IsActive)
	if err != nil {
		log.Printf("Error inserting website into database: %v", err)
		http.Error(w, "Error inserting website into database", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Website added successfully"})
}

// recieving reaults
func getResultsHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "results recieved"})
}
