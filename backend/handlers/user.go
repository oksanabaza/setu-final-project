package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"fullstack-scraper/database"

	"github.com/gorilla/mux"
)

type User struct {
	UserID         int            `json:"id"`
	Username       sql.NullString `json:"username"`
	Email          sql.NullString `json:"email"`
	Role           string         `json:"role"`
	Status         string         `json:"status"`
	LastLogin      sql.NullString `json:"last_login"`
	CreatedAt      string         `json:"created_at"`
	ProfilePicture sql.NullString `json:"profile_picture"`
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from URL parameters
	vars := mux.Vars(r)
	userIDStr := vars["userId"]

	log.Printf("Received user ID: %s", userIDStr)

	// Check if userID is a valid integer
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		log.Printf("Invalid user ID: %s", userIDStr)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Query the database to get the user data by user_id
	row := database.DB.QueryRow("SELECT user_id, username, email, role, status, last_login, created_at, profile_picture FROM users WHERE user_id = $1", userID)

	var user User
	if err := row.Scan(&user.UserID, &user.Username, &user.Email, &user.Role, &user.Status, &user.LastLogin, &user.CreatedAt, &user.ProfilePicture); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			log.Printf("Error scanning user: %v", err)
			http.Error(w, "Error fetching user data", http.StatusInternalServerError)
		}
		return
	}

	// Set the response headers and send the user data as a JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
