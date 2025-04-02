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

type ScrapingResult struct {
	ID        int       `json:"id,omitempty"`
	TaskID    int       `json:"TaskID"`
	Result    string    `json:"Result"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
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

	var result ScrapingResult
	query := `SELECT id, task_id, result, created_at, updated_at FROM scraping_results WHERE task_id = $1 LIMIT 1`
	err := database.DB.QueryRow(query, taskID).Scan(
		&result.ID, &result.TaskID, &result.Result, &result.CreatedAt, &result.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No result found for task_id %s", taskID)
			http.Error(w, "No result found for the specified task_id", http.StatusNotFound)
		} else {
			log.Printf("Error fetching result for task ID %s: %v", taskID, err)
			http.Error(w, "Failed to fetch result", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
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

	// Log received data for debugging
	// log.Printf("Received TaskID: %d, Result: %s", result.TaskID, result.Result)

	sqlStatement := `INSERT INTO scraping_results (task_id, result, created_at, updated_at) 
					 VALUES ($1, $2, NOW(), NOW())`

	// Insert data into the database
	_, err = database.DB.Exec(sqlStatement, result.TaskID, result.Result)
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
