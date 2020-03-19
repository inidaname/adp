package main

import (
	"net/http"
	"github.com/gorilla/mux"
	"fmt"
	"payment/middleware"
	"payment/routes"
)

func main() {
	fmt.Println("Working with Go")
	port := 3000
	var router = mux.NewRouter()
	r := routes.Router()
	m := middleware.CommonMiddleware
	router.Use(m)
	_, err := startWebServer(port)

	if err != nil {
		panic(err)
	}

	http.ListenAndServe(":3000", r)
}

func startWebServer(port int) (int, error) {
	fmt.Println("Starting server...")
	fmt.Println("Server started on port", port)


	return port, nil
}