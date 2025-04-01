package com.eventzen.budgetservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI budgetServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Budget Service API")
                        .description("Budget management API for EventZen application")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("EventZen Team")
                                .email("support@eventzen.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
} 