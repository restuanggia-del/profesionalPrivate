package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

func AdminDashboard(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()

	var totalUsers int64
	var totalStudents int64
	var totalTeachers int64
	var totalCourses int64
	var totalCertificates int64

	db.Table("users").Count(&totalUsers)
	db.Table("users").Where("role = ?", "student").Count(&totalStudents)
	db.Table("users").Where("role = ?", "teacher").Count(&totalTeachers)
	db.Table("courses").Count(&totalCourses)
	db.Table("certificates").Count(&totalCertificates)

	helpers.JSON(w, http.StatusOK, "Admin dashboard", map[string]interface{}{
		"users":        totalUsers,
		"students":     totalStudents,
		"teachers":     totalTeachers,
		"courses":      totalCourses,
		"certificates": totalCertificates,
	})
}
