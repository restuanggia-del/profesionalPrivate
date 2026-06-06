package controllers

import (
	"net/http"
	"os"

	"github.com/gorilla/mux"
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

func MyCertificates(w http.ResponseWriter, r *http.Request) {
	userID := helpers.GetUserID(r)
	db := helpers.GetDB()

	var certs []models.Certificate
	db.Where("user_id = ?", userID).Find(&certs)

	helpers.JSON(w, http.StatusOK, "My certificates", certs)
}

func DownloadCertificate(w http.ResponseWriter, r *http.Request) {
	userID := helpers.GetUserID(r)
	id := mux.Vars(r)["id"]

	db := helpers.GetDB()
	var cert models.Certificate

	if err := db.Where("id = ? AND user_id = ?", id, userID).
		First(&cert).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Certificate not found", nil)
		return
	}

	file, err := os.Open(cert.FilePath)
	if err != nil {
		helpers.JSON(w, http.StatusInternalServerError, "Failed to open PDF", nil)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=certificate.pdf")

	file.Stat()
	file.Seek(0, 0)
	file.WriteTo(w)
}
