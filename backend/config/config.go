package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var JWTKey []byte
var DBUrl string

func LoadEnv() {
	if os.Getenv("RENDER") == "" {
		if err := godotenv.Load(); err != nil {
			log.Fatal("Failed to load .env file")
		}
	}
	JWTKey = []byte(os.Getenv("JWT_SECRET"))
	DBUrl = os.Getenv("DB_URL")

	if DBUrl == "" {
		log.Fatal("DB_URL is not set in .env file")
	}
}
