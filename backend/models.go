package main

import "time"

type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`
	CreatedAt    time.Time `json:"created_at"`
}

type Website struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	URL       string    `json:"url"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type ScrapingTask struct {
	ID          int       `json:"id"`
	WebsiteID   int       `json:"website_id"`
	Status      string    `json:"status"`
	Progress    int       `json:"progress"`
	StartedAt   time.Time `json:"started_at"`
	CompletedAt time.Time `json:"completed_at"`
}

type ExtractedData struct {
	ID             int       `json:"id"`
	ScrapingTaskID int       `json:"scraping_task_id"`
	Data           string    `json:"data"`
	ExtractedAt    time.Time `json:"extracted_at"`
}
