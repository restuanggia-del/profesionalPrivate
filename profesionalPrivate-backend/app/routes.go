package app

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/controllers"
	"github.com/restuanggia/profesionalPrivate/app/middleware"
)

func (server *Server) initializeRoutes() {
	server.Router.HandleFunc("/", controllers.Home).Methods("GET")
	server.Router.HandleFunc("/api/health", controllers.HealthCheck).Methods("GET")

	server.Router.HandleFunc("/api/register", controllers.Register).Methods("POST")
	server.Router.HandleFunc("/api/login", controllers.Login).Methods("POST")

	server.Router.HandleFunc("/api/users", controllers.GetUsers).Methods("GET")
	server.Router.HandleFunc("/api/users/{id}", controllers.GetUserByID).Methods("GET")

	server.Router.Handle(
		"/api/me",
		middleware.AuthMiddleware(
			http.HandlerFunc(controllers.Me),
		),
	).Methods("GET")

	student := server.Router.PathPrefix("/api/student").Subrouter()
	student.Use(middleware.AuthMiddleware)
	student.Use(middleware.RoleMiddleware("student"))
	student.HandleFunc("/quiz", controllers.GetQuizForStudent).Methods("GET")
	student.HandleFunc("/quiz/submit", controllers.SubmitQuiz).Methods("POST")
	student.HandleFunc("/quiz/history", controllers.QuizHistory).Methods("GET")
	student.HandleFunc("/certificates", controllers.MyCertificates).Methods("GET")
	student.HandleFunc("/certificates/{id}/download", controllers.DownloadCertificate).Methods("GET")
	student.HandleFunc("/certificate", controllers.GenerateCertificate).Methods("POST")
	student.HandleFunc(
		"/courses/{course_id}/lessons",
		controllers.StudentLessons,
	).Methods("GET")
	student.HandleFunc(
		"/lessons/complete",
		controllers.CompleteLesson,
	).Methods("POST")

	student.HandleFunc("/join", controllers.JoinCourse).Methods("POST")
	student.HandleFunc("/courses", controllers.StudentCourses).Methods("GET")

	teacher := server.Router.PathPrefix("/api/teacher").Subrouter()
	teacher.Use(middleware.AuthMiddleware)
	teacher.Use(middleware.RoleMiddleware("teacher"))
	teacher.HandleFunc("/questions", controllers.CreateQuestion).Methods("POST")
	teacher.HandleFunc("/dashboard", controllers.TeacherDashboard).Methods("GET")
	teacher.HandleFunc(
		"/dashboard/analytics",
		controllers.TeacherAnalytics,
	).Methods("GET")
	teacher.HandleFunc(
		"/analytics/weekly",
		controllers.WeeklyAnalytics,
	).Methods("GET")
	teacher.HandleFunc(
		"/analytics/charts",
		controllers.ChartAnalytics,
	).Methods("GET")

	teacher.HandleFunc("/courses", controllers.CreateCourse).Methods("POST")
	teacher.HandleFunc("/courses", controllers.GetMyCourses).Methods("GET")

	teacher.HandleFunc("/lessons", controllers.CreateLesson).Methods("POST")

	teacher.HandleFunc("/quizzes", controllers.CreateQuiz).Methods("POST")

	admin := server.Router.PathPrefix("/api/admin").Subrouter()
	admin.Use(middleware.AuthMiddleware)
	admin.Use(middleware.RoleMiddleware("admin"))

	admin.HandleFunc("/dashboard", controllers.AdminDashboard).Methods("GET")

	admin.HandleFunc("/users", controllers.AdminUsers).Methods("GET")
	admin.HandleFunc("/users/{id}/role", controllers.ChangeUserRole).Methods("PATCH")

	admin.HandleFunc("/users", controllers.GetAllUsers).Methods("GET")
	admin.HandleFunc("/users/{id}/suspend", controllers.SuspendUser).Methods("PATCH")
}
