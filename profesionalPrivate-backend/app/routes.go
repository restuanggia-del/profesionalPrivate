package app

import "github.com/restuanggia/profesionalPrivate/app/controllers"

func (server *Server) initializeRoutes() {
	server.Router.HandleFunc("/", controllers.Home).Methods("GET")
	server.Router.HandleFunc("/api/health", controllers.HealthCheck).Methods("GET")
}
