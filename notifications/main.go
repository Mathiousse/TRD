package main

import (
    "log"
    "time"

    "github.com/streadway/amqp"
)

func main() {
    // Connexion RabbitMQ avec retry
    var conn *amqp.Connection
    var err error
    for i := 0; i < 5; i++ {
        conn, err = amqp.Dial("amqp://admin:admin123@rabbitmq:5672/")
        if err == nil {
            break
        }
        log.Printf("Connexion échouée (tentative %d/5): %v", i+1, err)
        time.Sleep(5 * time.Second)
    }
    if err != nil {
        log.Fatal("Échec final de connexion à RabbitMQ:", err)
    }
    defer conn.Close()

    log.Println("✅ Service de notifications connecté à RabbitMQ")
    
    // Garder le service actif
    select {}
}