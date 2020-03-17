package models

// import "go.mongodb.org/mongo-driver/bson/primitive"

type Payment struct {
	// ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	PaymentMethod string
	Payer string
	Amount float64
	Status string
}
