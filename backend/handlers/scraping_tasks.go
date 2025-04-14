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
	vars := mux.Vars(r)
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

	// Set default values if necessary
	if task.CreatedAt.IsZero() {
		task.CreatedAt = time.Now()
	}
	if task.UpdatedAt.IsZero() {
		task.UpdatedAt = time.Now()
	}

	sqlStatement := `INSERT INTO scraping_tasks 
	(user_id, website_id, url, name, category, status, priority, 
	attempts_count, last_error, schedule_cron, index_urls, created_at, updated_at, template_id) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`

	_, err := database.DB.Exec(sqlStatement, task.UserID, task.WebsiteID, task.URL, task.Name, task.Category, task.Status, task.Priority,
		task.AttemptsCount, task.LastError, task.ScheduleCron, task.IndexURLs, task.CreatedAt, task.UpdatedAt, task.TemplateID)

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

func UpdateScrapingTask(db *sql.DB, taskID int, userID int, websiteID int, name string, category string, status string,
	priority int, lastError string, scheduleCron string, indexUrls string, updatedAt string) error {
	sqlStatement := `UPDATE scraping_tasks SET user_id = $1, website_id = $2, name = $3, category = $4,
        status = $5, priority = $6, last_error = $7, schedule_cron = $8, index_urls = $9, updated_at = $10
        WHERE task_id = $11`

	params := []interface{}{
		userID,       // user_id
		websiteID,    // website_id
		name,         // name
		category,     // category
		status,       // status
		priority,     // priority
		lastError,    // last_error
		scheduleCron, // schedule_cron
		indexUrls,    // index_urls
		updatedAt,    // updated_at
		taskID,       // task_id
	}

	_, err := db.Exec(sqlStatement, params...)
	if err != nil {
		log.Printf("Error updating scraping task: %v", err)
		return err
	}

	log.Println("Scraping task updated successfully")
	return nil
}

// UpdateScrapingTaskHandler handles updating a scraping task
func UpdateScrapingTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID, err := strconv.Atoi(vars["task_id"])
	if err != nil {
		http.Error(w, "Invalid task_id", http.StatusBadRequest)
		return
	}

	var task ScrapingTask
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	task.UpdatedAt = time.Now()

	sqlStatement := `UPDATE scraping_tasks SET user_id = $1, website_id = $2, name = $3, category = $4,
		status = $5, priority = $6, last_error = $7, schedule_cron = $8, index_urls = $9, updated_at = $10
		WHERE task_id = $11`

	_, err = database.DB.Exec(sqlStatement,
		task.UserID,
		task.WebsiteID,
		task.Name,
		task.Category,
		task.Status,
		task.Priority,
		task.LastError,
		task.ScheduleCron,
		task.IndexURLs,
		task.UpdatedAt,
		taskID,
	)

	if err != nil {
		log.Printf("Error updating scraping task: %v", err)
		http.Error(w, "Error updating task", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// DeleteScrapingTaskHandler handles deleting a scraping task
func DeleteScrapingTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID, err := strconv.Atoi(vars["task_id"])
	if err != nil {
		http.Error(w, "Invalid task_id", http.StatusBadRequest)
		return
	}

	sqlStatement := `DELETE FROM scraping_tasks WHERE task_id = $1`
	_, err = database.DB.Exec(sqlStatement, taskID)
	if err != nil {
		log.Printf("Error deleting task: %v", err)
		http.Error(w, "Error deleting task", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// GetAllTasksHandler retrieves all tasks from the database
func GetAllTasksHandler(w http.ResponseWriter, r *http.Request) {
	// Query to fetch all tasks
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

	// Scan rows into the tasks slice
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
