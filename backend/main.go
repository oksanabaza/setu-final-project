package main

import (
	"fullstack-scraper/auth"
	"fullstack-scraper/config"
	"fullstack-scraper/database"
	"fullstack-scraper/handlers"
	"fullstack-scraper/middleware"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type ScrapingTask struct {
	TaskID       int       `json:"task_id" gorm:"primaryKey"`
	UserID       int       `json:"user_id"`
	WebsiteID    int       `json:"website_id"`
	WebsiteURL   string    `json:"website_url"`
	Name         string    `json:"name"`
	Category     string    `json:"category"`
	Status       string    `json:"status"`
	Priority     int       `json:"priority"`
	LastError    string    `json:"last_error,omitempty"`
	ScheduleCron string    `json:"schedule_cron"`
	IndexURLs    string    `json:"index_urls"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	CompletedAt  time.Time `json:"completed_at,omitempty"`
	// TemplateID   int       `json:"template_id"`
}

func main() {
	// Load environment variables
	config.LoadEnv()

	// Initialize database
	database.InitDB()
	defer database.DB.Close()

	// CORS settings
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Set up router
	r := mux.NewRouter()

	// Routes
	r.HandleFunc("/signup", auth.SignupHandler).Methods("POST")
	r.HandleFunc("/login", auth.LoginHandler).Methods("POST")
	r.HandleFunc("/websites/create", middleware.AuthMiddleware(handlers.CreateWebsite)).Methods("POST")
	r.HandleFunc("/websites", middleware.AuthMiddleware(handlers.GetWebsites)).Methods("GET")
	r.HandleFunc("/websites/{id}", middleware.AuthMiddleware(handlers.UpdateWebsite)).Methods("PUT")
	r.HandleFunc("/websites/{id}", middleware.AuthMiddleware(handlers.DeleteWebsite)).Methods("DELETE")
	// r.HandleFunc("/get-results", middleware.AuthMiddleware(handlers.GetResultsHandler)).Methods("GET")
	r.HandleFunc("/templates", middleware.AuthMiddleware(handlers.GetTemplates)).Methods("GET")
	r.HandleFunc("/templates/{id}", middleware.AuthMiddleware(handlers.EditTemplate)).Methods("PUT")
	r.HandleFunc("/templates/{id}", middleware.AuthMiddleware(handlers.DeleteTemplate)).Methods("DELETE")
	r.HandleFunc("/templates/create", middleware.AuthMiddleware(handlers.CreateTemplate)).Methods("POST")
	r.HandleFunc("/scraping-tasks/create", middleware.AuthMiddleware(handlers.CreateScrapingTask)).Methods("POST")
	r.HandleFunc("/scraping-task/{task_id}", middleware.AuthMiddleware(handlers.GetScrapingTaskHandler)).Methods("GET")
	r.HandleFunc("/scraping-task/{task_id}", middleware.AuthMiddleware(handlers.UpdateScrapingTaskHandler)).Methods("PUT")
	r.HandleFunc("/scraping-task/{task_id}", middleware.AuthMiddleware(handlers.DeleteScrapingTaskHandler)).Methods("DELETE")
	r.HandleFunc("/scrape", middleware.AuthMiddleware(handlers.ScrapeHandler)).Methods("POST")
	r.HandleFunc("/scraping-tasks", middleware.AuthMiddleware(handlers.GetAllScrapingTasksHandler)).Methods("GET")
	r.HandleFunc("/templates/{id}", middleware.AuthMiddleware(handlers.GetTemplateByID)).Methods("GET")
	r.HandleFunc("/get-results", middleware.AuthMiddleware(handlers.GetResultsHandler)).Methods("GET")
	r.HandleFunc("/post-results", middleware.AuthMiddleware(handlers.PostResultsHandler)).Methods("POST")

	// Add CORS middleware
	handler := corsHandler.Handler(r)

	log.Println("Server is running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
