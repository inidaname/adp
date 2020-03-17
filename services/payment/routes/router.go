package routes

import (
	"github.com/gorilla/mux"
	"payment/controllers"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/", controllers.PingAPI).Methods("GET", "OPTIONS")
	router.HandleFunc("/pay", controllers.CreatePayment).Methods("POST", "OPTIONS")
	return router
}