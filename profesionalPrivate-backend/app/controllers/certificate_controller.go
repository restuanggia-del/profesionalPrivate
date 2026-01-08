package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func GenerateCertificate(w http.ResponseWriter, r *http.Request) {
	userID := helpers.GetUserID(r)
	db := helpers.GetDB()

	var user models.User
	var course models.Course

	db.First(&user, userID)
	db.First(&course, r.URL.Query().Get("course_id"))

	filePath := helpers.GenerateCertificatePDF(user.Name, course.Title)

	cert := models.Certificate{
		UserID:   userID,
		CourseID: course.ID,
		FilePath: filePath,
	}

	db.Create(&cert)

	helpers.JSON(w, http.StatusOK, "Certificate generated", cert)
}
