package app

import "github.com/restuanggia/profesionalPrivate/app/controllers"

func (server *Server) initializeRoutes() {
	server.Router.HandleFunc("/", controllers.Home).Methods("GET")
	server.Router.HandleFunc("/api/health", controllers.HealthCheck).Methods("GET")

	server.Router.HandleFunc("/api/register", controllers.Register).Methods("POST")
	server.Router.HandleFunc("/api/login", controllers.Login).Methods("POST")

	server.Router.HandleFunc("/api/users", controllers.GetUsers).Methods("GET")
	server.Router.HandleFunc("/api/users/{id}", controllers.GetUserByID).Methods("GET")
}
