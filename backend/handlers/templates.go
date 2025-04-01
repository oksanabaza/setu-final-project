package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"fullstack-scraper/database"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Template structure
type Template struct {
	ID        int             `json:"id"`
	WebsiteID int             `json:"website_id"`
	UserID    int             `json:"user_id"`
	Name      string          `json:"name"`
	Settings  json.RawMessage `json:"settings"`
	// Wrapper      string          `json:"wrapper"`
	Wrapper      sql.NullString `json:"wrapper"`
	CreatedAt    time.Time      `json:"created_at"`
	ScrapingType string         `json:"scraping_type"`
}

func (t *Template) UnmarshalJSON(data []byte) error {
	type Alias Template
	aux := &struct {
		Wrapper interface{} `json:"wrapper"`
		*Alias
	}{
		Alias: (*Alias)(t),
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	switch v := aux.Wrapper.(type) {
	case string:
		t.Wrapper = sql.NullString{String: v, Valid: true}
	case nil:
		t.Wrapper = sql.NullString{Valid: false}
	default:
		return fmt.Errorf("unexpected type for wrapper: %T", v)
	}

	return nil
}

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

	// Convert settings struct to JSON
	settingsJSON, err := json.Marshal(template.Settings)
	if err != nil {
		log.Printf("Error marshalling settings: %v", err)
		http.Error(w, "Error marshalling settings", http.StatusInternalServerError)
		return
	}

	// Insert the template into the database with `wrapper` as a separate field
	err = database.DB.QueryRow("INSERT INTO templates (name, scraping_type, settings, wrapper, user_id, website_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
		template.Name, template.ScrapingType, settingsJSON, template.Wrapper, template.UserID, template.WebsiteID).Scan(&template.ID)

	if err != nil {
		log.Printf("Error inserting template into database: %v", err)
		http.Error(w, "Error inserting template into database", http.StatusInternalServerError)
		return
	}

	// Send a success response with the new template including its auto generated ID
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Template added successfully", "template": template})
}

func GetTemplateByID(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id := vars["id"]

	// If the ID is missing, return a bad request error
	if id == "" {
		http.Error(w, "Template ID is required", http.StatusBadRequest)
		return
	}

	// Query the database to get the template by its ID
	var template Template
	err := database.DB.QueryRow("SELECT id, website_id, user_id, name, settings, created_at, scraping_type, wrapper FROM templates WHERE id = $1", id).
		Scan(&template.ID, &template.WebsiteID, &template.UserID, &template.Name, &template.Settings, &template.CreatedAt, &template.ScrapingType, &template.Wrapper)

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
	// Check if the wrapper is NULL and set it to an empty string if needed
	if !template.Wrapper.Valid {
		template.Wrapper.String = ""
	}
	// Respond with the found template
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(template)
}

func EditTemplate(w http.ResponseWriter, r *http.Request) {
	var template Template
	vars := mux.Vars(r)
	id := vars["id"]

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

	// Convert settings struct to JSON
	settingsJSON, err := json.Marshal(template.Settings)
	if err != nil {
		log.Printf("Error marshalling settings: %v", err)
		http.Error(w, "Error marshalling settings", http.StatusInternalServerError)
		return
	}

	// Update the template in the database
	_, err = database.DB.Exec("UPDATE templates SET name = $1, scraping_type = $2, settings = $3, wrapper = $4, user_id = $5, website_id = $6 WHERE id = $7",
		template.Name, template.ScrapingType, settingsJSON, template.Wrapper, template.UserID, template.WebsiteID, id)

	if err != nil {
		log.Printf("Error updating template: %v", err)
		http.Error(w, "Error updating template", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Template updated successfully"})
}

func DeleteTemplate(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	// Validate if the ID is provided
	if id == "" {
		http.Error(w, "Template ID is required", http.StatusBadRequest)
		return
	}

	// Delete the template from the database
	_, err := database.DB.Exec("DELETE FROM templates WHERE id = $1", id)
	if err != nil {
		log.Printf("Error deleting template: %v", err)
		http.Error(w, "Error deleting template", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Template deleted successfully"})
}
