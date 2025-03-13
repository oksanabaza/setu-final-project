package handlers

import (
	"encoding/json"
	"net/http"
)

// type Results struct {
// }

// Receiving results
func GetResultsHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "results received"})
}
