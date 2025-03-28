package com.eventzen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class EventZenApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventZenApplication.class, args);
    }
}