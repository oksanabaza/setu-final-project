package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"fullstack-scraper/database"
)

type Website struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	URL       string `json:"url"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at"`
}

func GetWebsites(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, name, url, is_active, created_at FROM websites")
	if err != nil {
		http.Error(w, "Error querying websites", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var websites []Website
	for rows.Next() {
		var site Website
		if err := rows.Scan(&site.ID, &site.Name, &site.URL, &site.IsActive, &site.CreatedAt); err != nil {
			http.Error(w, "Error scanning website", http.StatusInternalServerError)
			return
		}
		websites = append(websites, site)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(websites)
}

// Adding website
func CreateWebsite(w http.ResponseWriter, r *http.Request) {
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
	_, err := database.DB.Exec("INSERT INTO websites (name, url, is_active) VALUES ($1, $2, $3)", site.Name, site.URL, site.IsActive)
	if err != nil {
		log.Printf("Error inserting website into database: %v", err)
		http.Error(w, "Error inserting website into database", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Website added successfully"})
}
