// package handlers

// import (
// 	"database/sql"
// 	"encoding/json"
// 	"fmt"
// 	"fullstack-scraper/database"
// 	"log"
// 	"net/http"
// 	"strconv"
// 	"time"

// 	"github.com/gorilla/mux"
// )

// // ScrapingTask represents a scraping task in the system
// type ScrapingTask struct {
// 	TaskID        int          `json:"task_id"`
// 	WebsiteID     int          `json:"website_id"`
// 	Status        string       `json:"status"`
// 	Progress      float64      `json:"progress"`
// 	StartedAt     sql.NullTime `json:"started_at"`
// 	CompletedAt   sql.NullTime `json:"completed_at"`
// 	UserID        int          `json:"user_id"`
// 	URL           string       `json:"website_url"`
// 	Name          string       `json:"name"`
// 	Category      string       `json:"category"`
// 	Priority      int          `json:"priority"`
// 	AttemptsCount int          `json:"attempts_count"`
// 	LastError     string       `json:"last_error"`
// 	ScheduleCron  string       `json:"schedule_cron"`
// 	IndexURLs     string       `json:"index_urls"`
// 	CreatedAt     time.Time    `json:"created_at"`
// 	UpdatedAt     time.Time    `json:"updated_at"`
// 	TemplateID    int          `json:"template_id"`
// }

// // Handler to fetch scraping task by ID
// func GetScrapingTaskHandler(w http.ResponseWriter, r *http.Request) {
// 	// Extract taskID from URL path (e.g., /scraping-task/2)
// 	vars := mux.Vars(r) // This extracts variables from the URL path
// 	taskIDStr := vars["task_id"]

// 	if taskIDStr == "" {
// 		http.Error(w, "task_id is required", http.StatusBadRequest)
// 		return
// 	}

// 	// Convert taskID to int
// 	taskID, err := strconv.Atoi(taskIDStr)
// 	if err != nil {
// 		http.Error(w, "invalid task_id", http.StatusBadRequest)
// 		return
// 	}

// 	// Fetch the scraping task by taskID
// 	task, err := GetScrapingTaskByID(taskID)
// 	if err != nil {
// 		// If there is an error fetching the task (e.g., database error)
// 		http.Error(w, "error fetching task", http.StatusInternalServerError)
// 		log.Printf("Error fetching task: %v", err)
// 		return
// 	}

// 	if task == nil {
// 		// If the task was not found
// 		http.Error(w, "task not found", http.StatusNotFound)
// 		return
// 	}

// 	// Return the task as JSON
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	err = json.NewEncoder(w).Encode(task)
// 	if err != nil {
// 		http.Error(w, "error encoding response", http.StatusInternalServerError)
// 		log.Println("Error encoding response:", err)
// 	}
// }

// // Function to fetch a scraping task by task ID
// func GetScrapingTaskByID(taskID int) (*ScrapingTask, error) {
// 	// Prepare the query
// 	query := `
// 		SELECT st.task_id, st.website_id, st.status, st.progress, st.started_at, st.completed_at,
// 		       st.user_id, w.url as website_url, st.name, st.category, st.priority, st.attempts_count,
// 		       st.last_error, st.schedule_cron, st.index_urls,
// 		       st.created_at, st.updated_at, at.template_id
// 		FROM scraping_tasks st
// 		JOIN websites w ON st.website_id = w.id
// 		WHERE st.task_id = $1;
// 	`

// 	// Execute the query
// 	var task ScrapingTask
// 	err := database.DB.QueryRow(query, taskID).Scan(
// 		&task.TaskID, &task.WebsiteID, &task.Status, &task.Progress, &task.StartedAt, &task.CompletedAt,
// 		&task.UserID, &task.URL, &task.Name, &task.Category, &task.Priority, &task.AttemptsCount,
// 		&task.LastError, &task.ScheduleCron, &task.IndexURLs,
// 		&task.CreatedAt, &task.UpdatedAt, &task.TemplateID,
// 	)

// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			// No task found with the given taskID
// 			return nil, nil
// 		}
// 		log.Println("Error fetching task:", err)
// 		return nil, err
// 	}

// 	return &task, nil
// }

// func GetScrapingTask(taskID int) (*ScrapingTask, error) {
// 	// Prepare response
// 	var task ScrapingTask

// 	// SQL query to fetch specific scraping task
// 	sqlStatement := `
//         SELECT task_id, user_id, website_id, url, name, category, status, priority,
//                last_error, schedule_cron, index_urls, created_at, updated_at,
//                completed_at, attempts_count, progress, started_at, template_id
//         FROM scraping_tasks WHERE task_id = $1`

// 	row := database.DB.QueryRow(sqlStatement, taskID)
// 	err := row.Scan(
// 		&task.TaskID, &task.UserID, &task.WebsiteID, &task.URL, &task.Name, &task.Category,
// 		&task.Status, &task.Priority, &task.LastError, &task.ScheduleCron, &task.IndexURLs,
// 		&task.CreatedAt, &task.UpdatedAt, &task.CompletedAt, &task.AttemptsCount,
// 		&task.Progress, &task.StartedAt, &task.TemplateID)

// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			return nil, fmt.Errorf("task with ID %d not found", taskID)
// 		}
// 		log.Printf("Error retrieving task: %v", err)
// 		return nil, fmt.Errorf("error retrieving task: %v", err)
// 	}

// 	return &task, nil
// }

// // CreateScrapingTask adds a new scraping task to the database
// func CreateScrapingTask(w http.ResponseWriter, r *http.Request) {
// 	var task ScrapingTask
// 	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	// Prepare SQL statement
// 	sqlStatement := `INSERT INTO scraping_tasks (user_id, website_id, url, name, category, status, priority,
// 		last_error, schedule_cron, index_urls, created_at, updated_at)
// 		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

// 	// Execute SQL
// 	_, err := database.DB.Exec(sqlStatement, task.UserID, task.WebsiteID, task.URL, task.Name, task.Category, task.Status, task.Priority,
// 		task.LastError, task.ScheduleCron, task.IndexURLs, task.CreatedAt, task.UpdatedAt)
// 	if err != nil {
// 		log.Printf("Error creating scraping task: %v", err)
// 		http.Error(w, "Error creating task", http.StatusInternalServerError)
// 		return
// 	}

// 	// Respond with success
// 	w.WriteHeader(http.StatusCreated)
// }

// // GetAllScrapingTasksHandler retrieves all scraping tasks from the database.
// func GetAllScrapingTasksHandler(w http.ResponseWriter, r *http.Request) {
// 	// Query to fetch all scraping tasks
// 	query := `
// 		SELECT st.task_id, st.website_id, st.status, st.progress, st.started_at, st.completed_at,
// 		       st.user_id, w.url as website_url, st.name, st.category, st.priority, st.attempts_count,
// 		       st.last_error, st.schedule_cron, st.index_urls,
// 		       st.created_at, st.updated_at
// 		FROM scraping_tasks st
// 		JOIN websites w ON st.website_id = w.id;
// 	`

// 	// Prepare the slice to store all tasks
// 	var tasks []ScrapingTask

// 	// Execute the query and scan results into the tasks slice
// 	rows, err := database.DB.Query(query)
// 	if err != nil {
// 		http.Error(w, "error fetching tasks", http.StatusInternalServerError)
// 		log.Println("Error fetching tasks:", err)
// 		return
// 	}
// 	defer rows.Close()

// 	for rows.Next() {
// 		var task ScrapingTask
// 		err := rows.Scan(
// 			&task.TaskID, &task.WebsiteID, &task.Status, &task.Progress, &task.StartedAt, &task.CompletedAt,
// 			&task.UserID, &task.URL, &task.Name, &task.Category, &task.Priority, &task.AttemptsCount,
// 			&task.LastError, &task.ScheduleCron, &task.IndexURLs,
// 			&task.CreatedAt, &task.UpdatedAt,
// 		)
// 		if err != nil {
// 			http.Error(w, "error scanning tasks", http.StatusInternalServerError)
// 			log.Println("Error scanning tasks:", err)
// 			return
// 		}
// 		tasks = append(tasks, task)
// 	}

// 	// Check if any tasks were found
// 	if len(tasks) == 0 {
// 		http.Error(w, "no tasks found", http.StatusNotFound)
// 		return
// 	}

// 	// Return the tasks as JSON
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	err = json.NewEncoder(w).Encode(tasks)
// 	if err != nil {
// 		http.Error(w, "error encoding response", http.StatusInternalServerError)
// 		log.Println("Error encoding response:", err)
// 	}
// }

// // UpdateScrapingTask updates an existing scraping task
// func UpdateScrapingTask(w http.ResponseWriter, r *http.Request) {
// 	var task ScrapingTask
// 	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	// Prepare SQL statement for updating task
// 	sqlStatement := `UPDATE scraping_tasks SET user_id = ?, website_id = ?, url = ?, name = ?, category = ?,
// 		status = ?, priority = ?, last_error = ?, schedule_cron = ?, index_urls = ?, updated_at = ?
// 		WHERE task_id = ?`

// 	// Execute SQL statement
// 	_, err := database.DB.Exec(sqlStatement, task.UserID, task.WebsiteID, task.URL, task.Name, task.Category, task.Status,
// 		task.Priority, task.LastError, task.ScheduleCron, task.IndexURLs, task.UpdatedAt, task.TaskID)
// 	if err != nil {
// 		log.Printf("Error updating scraping task: %v", err)
// 		http.Error(w, "Error updating task", http.StatusInternalServerError)
// 		return
// 	}

// 	// Respond with success
// 	w.WriteHeader(http.StatusOK)
// }

// // DeleteScrapingTask deletes a scraping task from the database
// func DeleteScrapingTask(w http.ResponseWriter, r *http.Request) {
// 	// Extract task ID from URL
// 	taskID := r.URL.Query().Get("task_id")

// 	// Prepare SQL statement
// 	sqlStatement := `DELETE FROM scraping_tasks WHERE task_id = ?`

// 	// Execute SQL statement
// 	_, err := database.DB.Exec(sqlStatement, taskID)
// 	if err != nil {
// 		log.Printf("Error deleting scraping task: %v", err)
// 		http.Error(w, "Error deleting task", http.StatusInternalServerError)
// 		return
// 	}

// 	// Respond with success
// 	w.WriteHeader(http.StatusOK)
// }

// // StartScraping is the function responsible for scraping
//
//	func StartScraping() {
//		log.Println("Scraping started...")
//	}
package handlers

import (
	"database/sql"
	"encoding/json"
	"fullstack-scraper/database"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// ScrapingTask represents a scraping task in the system
type ScrapingTask struct {
	TaskID        int          `json:"task_id"`
	WebsiteID     int          `json:"website_id"`
	Status        string       `json:"status"`
	Progress      float64      `json:"progress"`
	StartedAt     sql.NullTime `json:"started_at"`
	CompletedAt   sql.NullTime `json:"completed_at"`
	UserID        int          `json:"user_id"`
	URL           string       `json:"website_url"`
	Name          string       `json:"name"`
	Category      string       `json:"category"`
	Priority      int          `json:"priority"`
	AttemptsCount int          `json:"attempts_count"`
	LastError     string       `json:"last_error"`
	ScheduleCron  string       `json:"schedule_cron"`
	IndexURLs     string       `json:"index_urls"`
	CreatedAt     time.Time    `json:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
	TemplateID    int          `json:"template_id"`
}

// Handler to fetch scraping task by ID
func GetScrapingTaskHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r) // This extracts variables from the URL path
	taskIDStr := vars["task_id"]

	if taskIDStr == "" {
		http.Error(w, "task_id is required", http.StatusBadRequest)
		return
	}

	// Convert taskID to int
	taskID, err := strconv.Atoi(taskIDStr)
	if err != nil {
		http.Error(w, "invalid task_id", http.StatusBadRequest)
		return
	}

	// Fetch the scraping task by taskID
	task, err := GetScrapingTaskByID(taskID)
	if err != nil {
		http.Error(w, "error fetching task", http.StatusInternalServerError)
		log.Printf("Error fetching task: %v", err)
		return
	}

	if task == nil {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}

	// Return the task as JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(task)
	if err != nil {
		http.Error(w, "error encoding response", http.StatusInternalServerError)
		log.Println("Error encoding response:", err)
	}
}

// Function to fetch a scraping task by task ID
func GetScrapingTaskByID(taskID int) (*ScrapingTask, error) {
	query := `
    SELECT st.task_id, st.website_id, st.status, st.progress, st.started_at, st.completed_at, 
           st.user_id, w.url as website_url, st.name, st.category, st.priority, st.attempts_count, 
           st.last_error, st.schedule_cron, st.index_urls, 
           st.created_at, st.updated_at, at.id
    FROM scraping_tasks st
    JOIN websites w ON st.website_id = w.id
    JOIN templates at ON st.template_id = at.id 
    WHERE st.task_id = $1;

	`

	// Execute the query
	var task ScrapingTask
	err := database.DB.QueryRow(query, taskID).Scan(
		&task.TaskID, &task.WebsiteID, &task.Status, &task.Progress, &task.StartedAt, &task.CompletedAt,
		&task.UserID, &task.URL, &task.Name, &task.Category, &task.Priority, &task.AttemptsCount,
		&task.LastError, &task.ScheduleCron, &task.IndexURLs,
		&task.CreatedAt, &task.UpdatedAt, &task.TemplateID,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			// No task found with the given taskID
			return nil, nil
		}
		log.Println("Error fetching task:", err)
		return nil, err
	}

	return &task, nil
}

// CreateScrapingTask adds a new scraping task to the database
func CreateScrapingTask(w http.ResponseWriter, r *http.Request) {
	var task ScrapingTask
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Prepare SQL statement
	sqlStatement := `INSERT INTO scraping_tasks (user_id, website_id, url, name, category, status, priority, 
		last_error, schedule_cron, index_urls, created_at, updated_at) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	// Execute SQL
	_, err := database.DB.Exec(sqlStatement, task.UserID, task.WebsiteID, task.URL, task.Name, task.Category, task.Status, task.Priority,
		task.LastError, task.ScheduleCron, task.IndexURLs, task.CreatedAt, task.UpdatedAt)
	if err != nil {
		log.Printf("Error creating scraping task: %v", err)
		http.Error(w, "Error creating task", http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusCreated)
}

// GetAllScrapingTasksHandler retrieves all scraping tasks from the database
func GetAllScrapingTasksHandler(w http.ResponseWriter, r *http.Request) {
	// Query to fetch all scraping tasks
	query := `
		SELECT st.task_id, st.website_id, st.status, st.progress, st.started_at, st.completed_at, 
		       st.user_id, w.url as website_url, st.name, st.category, st.priority, st.attempts_count, 
		       st.last_error, st.schedule_cron, st.index_urls, 
		       st.created_at, st.updated_at
		FROM scraping_tasks st
		JOIN websites w ON st.website_id = w.id;
	`

	// Prepare the slice to store all tasks
	var tasks []ScrapingTask

	// Execute the query and scan results into the tasks slice
	rows, err := database.DB.Query(query)
	if err != nil {
		http.Error(w, "error fetching tasks", http.StatusInternalServerError)
		log.Println("Error fetching tasks:", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var task ScrapingTask
		err := rows.Scan(
			&task.TaskID, &task.WebsiteID, &task.Status, &task.Progress, &task.StartedAt, &task.CompletedAt,
			&task.UserID, &task.URL, &task.Name, &task.Category, &task.Priority, &task.AttemptsCount,
			&task.LastError, &task.ScheduleCron, &task.IndexURLs,
			&task.CreatedAt, &task.UpdatedAt,
		)
		if err != nil {
			http.Error(w, "error scanning tasks", http.StatusInternalServerError)
			log.Println("Error scanning tasks:", err)
			return
		}
		tasks = append(tasks, task)
	}

	// Check if any tasks were found
	if len(tasks) == 0 {
		http.Error(w, "no tasks found", http.StatusNotFound)
		return
	}

	// Return the tasks as JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(tasks)
	if err != nil {
		http.Error(w, "error encoding response", http.StatusInternalServerError)
		log.Println("Error encoding response:", err)
	}
}

// UpdateScrapingTask updates an existing scraping task
func UpdateScrapingTask(w http.ResponseWriter, r *http.Request) {
	var task ScrapingTask
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Prepare SQL statement for updating task
	sqlStatement := `UPDATE scraping_tasks SET user_id = ?, website_id = ?, url = ?, name = ?, category = ?, 
		status = ?, priority = ?, last_error = ?, schedule_cron = ?, index_urls = ?, updated_at = ? 
		WHERE task_id = ?`

	// Execute SQL statement
	_, err := database.DB.Exec(sqlStatement, task.UserID, task.WebsiteID, task.URL, task.Name, task.Category, task.Status,
		task.Priority, task.LastError, task.ScheduleCron, task.IndexURLs, task.UpdatedAt, task.TaskID)
	if err != nil {
		log.Printf("Error updating scraping task: %v", err)
		http.Error(w, "Error updating task", http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
}

// DeleteScrapingTask deletes a scraping task from the database
func DeleteScrapingTask(w http.ResponseWriter, r *http.Request) {
	// Extract task ID from URL
	taskID := r.URL.Query().Get("task_id")

	// Prepare SQL statement
	sqlStatement := `DELETE FROM scraping_tasks WHERE task_id = ?`

	// Execute SQL statement
	_, err := database.DB.Exec(sqlStatement, taskID)
	if err != nil {
		log.Printf("Error deleting scraping task: %v", err)
		http.Error(w, "Error deleting task", http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
}

// StartScraping is the function responsible for scraping
// func StartScraping(w http.ResponseWriter, r *http.Request) {
// 	log.Println("Scraping started...")
// }
