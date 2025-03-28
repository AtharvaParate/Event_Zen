package com.eventzen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class AttendeeServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AttendeeServiceApplication.class, args);
    }
}