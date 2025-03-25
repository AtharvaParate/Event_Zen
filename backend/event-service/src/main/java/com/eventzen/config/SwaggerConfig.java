package com.eventzen.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger configuration for API documentation
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI eventZenOpenAPI() {
        Server devServer = new Server()
                .url("http://localhost:8080")
                .description("Development server");

        Server prodServer = new Server()
                .url("https://api.eventzen.com")
                .description("Production server");

        Contact contact = new Contact()
                .name("EventZen Team")
                .email("support@eventzen.com")
                .url("https://eventzen.com");

        Info info = new Info()
                .title("EventZen API Documentation")
                .version("1.0.0")
                .contact(contact)
                .description("This API exposes endpoints for managing events and vendors in the EventZen application.")
                .termsOfService("https://eventzen.com/terms")
                .license(new License()
                        .name("Apache 2.0")
                        .url("https://www.apache.org/licenses/LICENSE-2.0.html"));

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}