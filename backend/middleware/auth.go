package middleware

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
)

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

var jwtKey []byte
var db *sql.DB

func init() {
	// loading .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal(".env loading failed")
	}

	// reading vars from .env
	jwtKey = []byte(os.Getenv("JWT_SECRET"))
	dbURL := os.Getenv("DB_URL")

	// connecting to db
	var err error
	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("db connection failed:", err)
	}

	// Check if the connection is working
	if err := db.Ping(); err != nil {
		log.Fatal("DB is not reachable:", err)
	}

}

// Middleware for auth
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
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			log.Println("Error validating token:", err)
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}
