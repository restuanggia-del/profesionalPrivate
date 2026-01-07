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

	student.HandleFunc("/join", controllers.JoinCourse).Methods("POST")
	student.HandleFunc("/courses", controllers.StudentCourses).Methods("GET")

	teacher := server.Router.PathPrefix("/api/teacher").Subrouter()
	teacher.Use(middleware.AuthMiddleware)
	teacher.Use(middleware.RoleMiddleware("teacher"))

	teacher.HandleFunc("/dashboard", controllers.TeacherDashboard).Methods("GET")
	teacher.HandleFunc("/courses", controllers.CreateCourse).Methods("POST")

	teacher.HandleFunc("/courses", controllers.GetMyCourses).Methods("GET")
}
