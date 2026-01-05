package app

import "github.com/restuanggia/profesionalPrivate/app/controllers"

func (server *Server) initializeRoutes() {
	server.Router.HandleFunc("/", controllers.Home).Methods("GET")
	server.Router.HandleFunc("/api/health", controllers.HealthCheck).Methods("GET")

	// Users
	server.Router.HandleFunc("/api/users", controllers.GetUsers).Methods("GET")
	server.Router.HandleFunc("/api/users/{id}", controllers.GetUserByID).Methods("GET")
	server.Router.HandleFunc("/api/users", controllers.CreateUser).Methods("POST")
}
