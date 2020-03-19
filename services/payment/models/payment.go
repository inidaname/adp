package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Payment struct {
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	PaymentMethod string `bson:"paymentMethod" json:"paymentMethod"`
	Payer string `bson: "payer" json: "payer"`
	Amount float64 `bson: "amount" json: "amount"`
	Status string `bson: "status" json: "payer"`
}
