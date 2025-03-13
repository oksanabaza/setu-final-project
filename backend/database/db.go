package database

import (
	"database/sql"
	"log"

	"fullstack-scraper/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("postgres", config.DBUrl)
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	if err := DB.Ping(); err != nil {
		log.Fatal("DB is not reachable:", err)
	}

	log.Println("Connected to the database successfully")
}
