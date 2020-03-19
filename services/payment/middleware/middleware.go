package middleware

import (
	"net/http"
	"time"
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)



func MongoDBC() *mongo.Collection {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		panic(err)
	}

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	log.Println("MongoDB connected")
	if err != nil {
		panic(err)
	}

	// defer client.Disconnect(ctx)

	adpdb := client.Database("adp")
	payment := adpdb.Collection("payment")

	return payment
}

func CommonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
		next.ServeHTTP(w, r)
	})
}