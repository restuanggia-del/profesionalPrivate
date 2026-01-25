package helpers

import (
	"encoding/json"
	"net/http"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Errors  interface{} `json:"errors,omitempty"`
}

func JSON(w http.ResponseWriter, status int, message string, data interface{}, errors ...interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	response := APIResponse{
		Success: status >= 200 && status < 300,
		Message: message,
		Data:    data,
		Errors:  errors,
	}

	json.NewEncoder(w).Encode(response)
}
