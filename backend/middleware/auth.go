package middleware

import (
	"database/sql"
	"fullstack-scraper/config"
	"log"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v4"
)

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

var jwtKey []byte
var DB *sql.DB

func LoadEnv() {
	jwtKey = []byte(os.Getenv("JWT_SECRET"))
	DBUrl := os.Getenv("DB_URL")

	if DBUrl == "" {
		log.Fatal("DB_URL is not set in environment")
	}

	var err error
	DB, err = sql.Open("postgres", DBUrl)
	if err != nil {
		log.Fatal("Error opening database connection: ", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Error pinging database: ", err)
	}
}

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			http.Error(w, "token is missing", http.StatusUnauthorized)
			return
		}
		tokenStr = tokenStr[len("Bearer "):]

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return config.JWTKey, nil
		})

		if err != nil || !token.Valid {
			log.Println("Error validating token:", err)
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}
