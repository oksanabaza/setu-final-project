package handlers

import (
	"database/sql"
	"encoding/json"
	"fullstack-scraper/database"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Template structure
type Template struct {
	ID           int             `json:"id"`
	WebsiteID    int             `json:"website_id"`
	UserID       int             `json:"user_id"`
	Name         string          `json:"name"`
	Settings     json.RawMessage `json:"settings"`
	CreatedAt    time.Time       `json:"created_at"`
	ScrapingType string          `json:"scraping_type"`
}

// GET /templates
func GetTemplates(w http.ResponseWriter, r *http.Request) {
	// Query to get all templates from the database
	rows, err := database.DB.Query("SELECT id, website_id, user_id, name, settings, created_at, scraping_type FROM templates")
	if err != nil {
		log.Printf("Error querying templates: %v", err)
		http.Error(w, "Error querying templates", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Slice to hold all templates
	var templates []Template

	// Loop through rows and append templates to the slice
	for rows.Next() {
		var template Template
		// Scan all columns, including the settings (JSON)
		err := rows.Scan(&template.ID, &template.WebsiteID, &template.UserID, &template.Name, &template.Settings, &template.CreatedAt, &template.ScrapingType)
		if err != nil {
			log.Printf("Error scanning template: %v", err)
			http.Error(w, "Error scanning template", http.StatusInternalServerError)
			return
		}
		templates = append(templates, template)
	}

	// Check for any error after iterating over rows
	if err := rows.Err(); err != nil {
		log.Printf("Error with rows: %v", err)
		http.Error(w, "Error processing rows", http.StatusInternalServerError)
		return
	}

	// Respond with the list of templates
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(templates)
}

// POST /templates/create
func CreateTemplate(w http.ResponseWriter, r *http.Request) {
	var template Template

	// Decode the request body into the Template struct
	if err := json.NewDecoder(r.Body).Decode(&template); err != nil {
		log.Printf("Error decoding request: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate the required fields
	if template.Name == "" || template.ScrapingType == "" || template.UserID == 0 || template.WebsiteID == 0 {
		log.Printf("Missing required fields: Name='%v', ScrapingType='%v', UserID='%v', WebsiteID='%v'", template.Name, template.ScrapingType, template.UserID, template.WebsiteID)
		http.Error(w, "Name, scraping type, user ID, and website ID are required", http.StatusBadRequest)
		return
	}

	// Insert the template into the database without the `id` field
	err := database.DB.QueryRow("INSERT INTO templates (name, scraping_type, settings, user_id, website_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		template.Name, template.ScrapingType, template.Settings, template.UserID, template.WebsiteID).Scan(&template.ID)

	if err != nil {
		log.Printf("Error inserting template into database: %v", err)
		http.Error(w, "Error inserting template into database", http.StatusInternalServerError)
		return
	}

	// Send a success response with the new template including its auto-generated ID
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Template added successfully", "template": template})
}

// GET /templates/{id}
func GetTemplateByID(w http.ResponseWriter, r *http.Request) {
	// Use mux to get the template ID from the URL path
	vars := mux.Vars(r) // Get the path variables
	id := vars["id"]    // Get the 'id' from the URL

	// If the ID is missing, return a bad request error
	if id == "" {
		http.Error(w, "Template ID is required", http.StatusBadRequest)
		return
	}

	// Query the database to get the template by its ID
	var template Template
	err := database.DB.QueryRow("SELECT id, website_id, user_id, name, settings, created_at, scraping_type FROM templates WHERE id = $1", id).
		Scan(&template.ID, &template.WebsiteID, &template.UserID, &template.Name, &template.Settings, &template.CreatedAt, &template.ScrapingType)

	if err != nil {
		if err == sql.ErrNoRows {
			// If no template found with the given ID, return a 404 error
			http.Error(w, "Template not found", http.StatusNotFound)
		} else {
			// If there is another error, return a 500 internal server error
			log.Printf("Error querying template by ID: %v", err)
			http.Error(w, "Error querying template by ID", http.StatusInternalServerError)
		}
		return
	}

	// Respond with the found template
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(template)
}
