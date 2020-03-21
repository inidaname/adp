package main

import (
	"net/http"
	"fmt"
	"payment/routes"
)

func main() {
	fmt.Println("Working with Go")
	port := 3000
	r := routes.Router()
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