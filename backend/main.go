package main

import (
	"log"
	"net/http"

	"fullstack-scraper/auth"
	"fullstack-scraper/config"
	"fullstack-scraper/database"
	"fullstack-scraper/handlers"
	"fullstack-scraper/middleware"

	"github.com/rs/cors"
)

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

	// Routes
	http.HandleFunc("/signup", auth.SignupHandler)
	http.HandleFunc("/login", auth.LoginHandler)
	http.HandleFunc("/websites/create", middleware.AuthMiddleware(handlers.CreateWebsite))
	http.HandleFunc("/websites", middleware.AuthMiddleware(handlers.GetWebsites))
	http.HandleFunc("/get-results", middleware.AuthMiddleware(handlers.GetResultsHandler))
	http.HandleFunc("/templates", middleware.AuthMiddleware(handlers.GetTemplates))          // GET /templates
	http.HandleFunc("/templates/create", middleware.AuthMiddleware(handlers.CreateTemplate)) // POST /templates/create
	http.HandleFunc("/scrape", middleware.AuthMiddleware(handlers.ScrapeHandler))
	// http.HandleFunc("/scrape", handlers.ScrapeHandler)
	handler := corsHandler.Handler(http.DefaultServeMux)

	log.Println("Server is running on :8080")
	// fmt.Println("Available routes:")
	// http.DefaultServeMux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	fmt.Fprintf(w, "Route: %s", r.URL.Path)
	// }))
	log.Fatal(http.ListenAndServe(":8080", handler))
}
