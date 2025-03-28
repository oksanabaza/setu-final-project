package database

import (
	"database/sql"
	"log"

	"fullstack-scraper/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// InitDB initializes the PostgreSQL database connection
func InitDB() {
	var err error

	// Open a connection to the database using the URL from the config
	DB, err = sql.Open("postgres", config.DBUrl)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err) // Use log.Fatalf to log and exit immediately
	}

	// Check if the connection is successful by pinging the database
	if err := DB.Ping(); err != nil {
		log.Fatalf("DB is not reachable: %v", err)
	}

	// Log success
	log.Println("Connected to the database successfully")
}
