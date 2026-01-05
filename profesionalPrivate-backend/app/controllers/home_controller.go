package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

func Home(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"message": "Welcome to Profesional Private API",
	}

	helpers.JSON(w, http.StatusOK, data)
}
