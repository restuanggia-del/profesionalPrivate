package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

func TeacherDashboard(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"message": "Welcome teacher 👨‍🏫",
	}

	helpers.JSON(w, http.StatusOK, "Teacher access granted", data)
}
