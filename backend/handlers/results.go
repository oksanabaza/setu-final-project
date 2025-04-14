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

type ScrapingResult struct {
	ID        int            `json:"id,omitempty"`
	TaskID    int            `json:"TaskID"`
	Result    string         `json:"Result"`
	UniqueID  sql.NullString `json:"unique_id,omitempty"`
	CreatedAt time.Time      `json:"created_at,omitempty"`
	UpdatedAt time.Time      `json:"updated_at,omitempty"`
}

// GetResultsHandler handles GET requests for scraping results
func GetResultsHandler(w http.ResponseWriter, r *http.Request) {
	// Get the task_id from the URL path parameter
	vars := mux.Vars(r)
	taskID := vars["task_id"]
	if taskID == "" {
		http.Error(w, "task_id is required", http.StatusBadRequest)
		return
	}

	// Query to fetch all results for the given task_id
	query := `SELECT id, task_id, result, unique_id, created_at, updated_at 
	          FROM scraping_results WHERE task_id = $1`

	rows, err := database.DB.Query(query, taskID)
	if err != nil {
		log.Printf("Error fetching results for task ID %s: %v", taskID, err)
		http.Error(w, "Failed to fetch results", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []ScrapingResult

	// Iterate over all rows and append each result to the results slice
	for rows.Next() {
		var result ScrapingResult
		err := rows.Scan(&result.ID, &result.TaskID, &result.Result, &result.UniqueID, &result.CreatedAt, &result.UpdatedAt)
		if err != nil {
			log.Printf("Error scanning row for task ID %s: %v", taskID, err)
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		// Handle the case where UniqueID is NULL
		if !result.UniqueID.Valid {
			result.UniqueID.String = ""
		}

		// Append each result to the results slice
		results = append(results, result)
	}

	// Check if there were no results
	if len(results) == 0 {
		log.Printf("No results found for task_id %s", taskID)
		http.Error(w, "No results found for the specified task_id", http.StatusNotFound)
		return
	}

	// Set the content type to application/json and return the results as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]interface{}{"Results": results}); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

// GetAllResultsHandler handles GET requests to fetch all scraping results for any task_id
func GetAllResultsHandler(w http.ResponseWriter, r *http.Request) {
	// Query to fetch all results from the database
	query := `SELECT id, task_id, result, unique_id, created_at, updated_at 
	          FROM scraping_results`

	rows, err := database.DB.Query(query)
	if err != nil {
		log.Printf("Error fetching all results: %v", err)
		http.Error(w, "Failed to fetch all results", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []ScrapingResult

	// Iterate over all rows and append each result to the results slice
	for rows.Next() {
		var result ScrapingResult
		err := rows.Scan(&result.ID, &result.TaskID, &result.Result, &result.UniqueID, &result.CreatedAt, &result.UpdatedAt)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		// Handle the case where UniqueID is NULL
		if !result.UniqueID.Valid {
			result.UniqueID.String = ""
		}

		// Append each result to the results slice
		results = append(results, result)
	}

	// Check if there were no results
	if len(results) == 0 {
		log.Printf("No results found")
		http.Error(w, "No results found", http.StatusNotFound)
		return
	}

	// Set the content type to application/json and return the results as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]interface{}{"Results": results}); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

// GetSpecificResultHandler handles GET requests for a specific scraping result by id or unique_id
func GetSpecificResultHandler(w http.ResponseWriter, r *http.Request) {
	// Get the task_id and result identifier from the URL path parameters
	vars := mux.Vars(r)
	id := vars["id"]
	uniqueID := vars["unique_id"]

	var query string
	var row *sql.Row

	// Check which parameter is provided
	if id != "" {
		// Fetch result by id
		query = `SELECT id, task_id, result, unique_id, created_at, updated_at 
				  FROM scraping_results WHERE id = $1`
		row = database.DB.QueryRow(query, id)
	} else if uniqueID != "" {
		// Fetch result by unique_id
		query = `SELECT id, task_id, result, unique_id, created_at, updated_at 
				  FROM scraping_results WHERE unique_id = $1`
		row = database.DB.QueryRow(query, uniqueID)
	} else {
		http.Error(w, "Either 'id' or 'unique_id' is required", http.StatusBadRequest)
		return
	}

	// Scan the result into the ScrapingResult struct
	var result ScrapingResult
	err := row.Scan(&result.ID, &result.TaskID, &result.Result, &result.UniqueID, &result.CreatedAt, &result.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No result found for id: %s or unique_id: %s", id, uniqueID)
			http.Error(w, "No result found for the specified id or unique_id", http.StatusNotFound)
		} else {
			log.Printf("Error fetching result for id: %s or unique_id: %s: %v", id, uniqueID, err)
			http.Error(w, "Failed to fetch result", http.StatusInternalServerError)
		}
		return
	}

	// Handle the case where UniqueID is NULL
	if !result.UniqueID.Valid {
		result.UniqueID.String = "" // Set to an empty string or some default value if NULL
	}

	// Set the content type to application/json and return the result as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(result); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

// PostResultsHandler handles POST requests to store new scraping results
func PostResultsHandler(w http.ResponseWriter, r *http.Request) {
	var result ScrapingResult

	// Decode the request body into the ScrapingResult struct
	err := json.NewDecoder(r.Body).Decode(&result)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate the required fields
	if result.TaskID == 0 || result.Result == "" {
		http.Error(w, "TaskID and Result are required", http.StatusBadRequest)
		return
	}

	// Generate a unique_id using TaskID and current timestamp
	uniqueID := fmt.Sprintf("%d_%s", result.TaskID, time.Now().Format("20060102150405"))

	// Convert to sql.NullString
	result.UniqueID = sql.NullString{
		String: uniqueID,
		Valid:  true,
	}

	// Insert data into the database
	sqlStatement := `INSERT INTO scraping_results (task_id, result, unique_id, created_at, updated_at) 
					 VALUES ($1, $2, $3, NOW(), NOW())`

	_, err = database.DB.Exec(sqlStatement, result.TaskID, result.Result, result.UniqueID)
	if err != nil {
		log.Printf("Error saving result for task ID %d: %v", result.TaskID, err)
		http.Error(w, "Failed to save result", http.StatusInternalServerError)
		return
	}

	// Respond with a success message
	w.WriteHeader(http.StatusCreated)
	response := map[string]interface{}{
		"message": "Result created successfully",
		"result":  result,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
