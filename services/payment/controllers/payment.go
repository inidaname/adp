package controllers

import (
	"time"
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/mongo"
	"payment/models"
	"net/http"
	"fmt"
)

type Payments struct {
	Payment models.Payment
}

type Status struct {
	Status bool
}

var connection *mongo.Collection

func PingAPI(w http.ResponseWriter, r *http.Request) {
	// ctx, _ := context.WithTimeout(context.Background(), 10*time.Second
	var s Status = Status{Status: true}
	json.NewEncoder(w).Encode(s)
}

func CreatePayment(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(),10*time.Second)

	var payment models.Payment

	_ = json.NewDecoder(r.Body).Decode(&payment)
	defer r.Body.Close()

	if err != nil {
		return nil, err
	}
	insert, _ := connection.InsertOne(ctx, payment)
	json.NewEncoder(w).Encode(insert)
}

