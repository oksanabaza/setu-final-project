// package config

// import (
// 	"log"
// 	"os"

// 	"github.com/joho/godotenv"
// )

// var JWTKey []byte
// var DBUrl string

// func LoadEnv() {
// 	if os.Getenv("RENDER") == "" {
// 		if err := godotenv.Load(); err != nil {
// 			log.Fatal("Failed to load .env file")
// 		}
// 	}
// 	JWTKey = []byte(os.Getenv("JWT_SECRET"))
// 	DBUrl = os.Getenv("DB_URL")

//		if DBUrl == "" {
//			log.Fatal("DB_URL is not set in .env file")
//		}
//	}
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
		log.Println("Running locally. Loading .env file...")
		if err := godotenv.Load(); err != nil {
			log.Fatal("Failed to load .env file")
		}
	} else {
		log.Println("Running on Render. Using environment variables.")
	}

	JWTKey = []byte(os.Getenv("JWT_SECRET"))
	DBUrl = os.Getenv("DB_URL")

	log.Println("Loaded JWT secret length:", len(JWTKey))
	log.Println("Loaded DB URL:", DBUrl)

	if DBUrl == "" {
		log.Fatal("DB_URL is not set")
	}
	if len(JWTKey) == 0 {
		log.Fatal("JWT_SECRET is not set")
	}
}
