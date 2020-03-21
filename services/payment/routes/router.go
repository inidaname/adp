package routes

import (
	"github.com/gorilla/mux"
	"payment/controllers"
	"payment/middleware"
)

func Router() *mux.Router {
	router := mux.NewRouter()
	m := middleware.CommonMiddleware

	router.Use(m)

	router.HandleFunc("/", controllers.PingAPI).Methods("GET", "OPTIONS")
	router.HandleFunc("/pay", controllers.CreatePayment).Methods("POST", "OPTIONS")
	router.HandleFunc("/pay", controllers.GetAllPayments).Methods("GET", "OPTIONS")
	router.HandleFunc("/pay/{id}", controllers.GetPaymentByID).Methods("POST", "OPTIONS")
	return router
}