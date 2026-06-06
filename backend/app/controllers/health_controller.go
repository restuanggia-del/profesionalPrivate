package controllers

import (
	"net/http"
	"time"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	data := map[string]interface{}{
		"service": "Profesional Private API",
		"time":    time.Now().Format(time.RFC3339),
	}

	helpers.JSON(w, http.StatusOK, "Service is healthy", data)
}
