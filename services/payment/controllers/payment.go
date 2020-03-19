package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"payment/middleware"
	"payment/models"

	// "go.mongodb.org/mongo-driver/bson"
	"time"

	"github.com/gorilla/mux"
)

type Payments struct {
	Payment models.Payment
}

type Status struct {
	Status bool
}


func PingAPI(w http.ResponseWriter, r *http.Request) {
	// ctx, _ := context.WithTimeout(context.Background(), 10*time.Second
	var s Status = Status{Status: true}
	json.NewEncoder(w).Encode(s)
}

func CreatePayment(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	r.ParseForm()
	body := json.NewDecoder(r.Body)
	var payment models.Payment
	// payment.ID = bson.NewObjectId()
	err := body.Decode(&payment)

	if err != nil {
		panic(err)
	}
	
	paymentDB := middleware.MongoDBC()
	

	insert, err := paymentDB.InsertOne(ctx, payment)

	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(insert)
}

func GetPaymentByID(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	params := mux.Vars(r)
	id := params["id"]

	paymentDB := middleware.MongoDBC()

	getpayment, err := paymentDB.FindOne(ctx.P filter).Decode(&result)

	log.Println(id, ctx)
}

