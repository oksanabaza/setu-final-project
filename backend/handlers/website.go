package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"fullstack-scraper/database"

	"github.com/gorilla/mux"
)

// NullableString is a wrapper for sql.NullString to handle nulls and string values
type NullableString struct {
	sql.NullString
}

// MarshalJSON customizes the JSON marshalling for NullableString.
func (ns *NullableString) MarshalJSON() ([]byte, error) {
	if ns.Valid {
		return json.Marshal(ns.String)
	}
	// If the value is not valid (null), return null.
	return json.Marshal(nil)
}

// UnmarshalJSON customizes the JSON unmarshalling for NullableString.
func (ns *NullableString) UnmarshalJSON(data []byte) error {
	var str string
	if err := json.Unmarshal(data, &str); err == nil {
		ns.String = str
		ns.Valid = true
		return nil
	}

	var nullValue interface{}
	if err := json.Unmarshal(data, &nullValue); err == nil && nullValue == nil {
		ns.Valid = false
		return nil
	}

	return fmt.Errorf("invalid value for NullableString")
}

type Website struct {
	ID        int            `json:"id"`
	Name      string         `json:"name"`
	URL       string         `json:"url"`
	IsActive  bool           `json:"is_active"`
	CreatedAt string         `json:"created_at"`
	Tag       NullableString `json:"tag"`
	ImageURL  NullableString `json:"image_url"`
}

func GetWebsites(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, name, url, is_active, created_at, tag, image_url FROM websites")
	if err != nil {
		http.Error(w, "Error querying websites", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var websites []Website
	for rows.Next() {
		var site Website
		if err := rows.Scan(&site.ID, &site.Name, &site.URL, &site.IsActive, &site.CreatedAt, &site.Tag, &site.ImageURL); err != nil {
			http.Error(w, "Error scanning website", http.StatusInternalServerError)
			return
		}
		websites = append(websites, site)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(websites)
}

func CreateWebsite(w http.ResponseWriter, r *http.Request) {
	var site Website

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
	_, err := database.DB.Exec("INSERT INTO websites (name, url, is_active, tag, image_url) VALUES ($1, $2, $3, $4, $5)", site.Name, site.URL, site.IsActive, site.Tag, site.ImageURL)
	if err != nil {
		log.Printf("Error inserting website into database: %v", err)
		http.Error(w, "Error inserting website into database", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Website added successfully"})
}

func UpdateWebsite(w http.ResponseWriter, r *http.Request) {
	var site Website
	// Extract website ID from URL
	vars := mux.Vars(r)
	siteID := vars["id"]

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

	// Update the website in the database
	_, err := database.DB.Exec("UPDATE websites SET name = $1, url = $2, is_active = $3, tag = $4, image_url = $5 WHERE id = $6", site.Name, site.URL, site.IsActive, site.Tag, site.ImageURL, siteID)
	if err != nil {
		log.Printf("Error updating website in database: %v", err)
		http.Error(w, "Error updating website in database", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Website updated successfully"})
}

func DeleteWebsite(w http.ResponseWriter, r *http.Request) {
	// Extract website ID from URL
	vars := mux.Vars(r)
	siteID := vars["id"]

	// Delete the website from the database
	_, err := database.DB.Exec("DELETE FROM websites WHERE id = $1", siteID)
	if err != nil {
		log.Printf("Error deleting website from database: %v", err)
		http.Error(w, "Error deleting website from database", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Website deleted successfully"})
}
