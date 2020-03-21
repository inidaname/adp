package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"payment/middleware"
	"payment/models"

	"go.mongodb.org/mongo-driver/bson"
	"time"
    "go.mongodb.org/mongo-driver/mongo/options"
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

func GetAllPayments(w http.ResponseWriter, r *http.Request)  {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	var results []*models.Payment

	findOptions := options.Find()
	findOptions.SetLimit(2)
	
	paymentDB := middleware.MongoDBC()
	

	cur, _ := paymentDB.Find(ctx, bson.D{}, findOptions)

	for cur.Next(context.TODO()) {
    
		// create a value into which the single document can be decoded
		var elem models.Payment
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}
	
		results = append(results, &elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	
	// Close the cursor once finished
	cur.Close(context.TODO())
	
	json.NewEncoder(w).Encode(results)
}

func GetPaymentByID(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	params := mux.Vars(r)
	id := params["id"]

	// paymentDB := middleware.MongoDBC()

	// getpayment, err := paymentDB.FindOne(ctx.P filter).Decode(&result)

	log.Println(id, ctx)
}

