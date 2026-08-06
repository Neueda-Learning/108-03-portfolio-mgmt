package com.neueda.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI portfolioApi() {
        return new OpenAPI().info(
                new Info()
                        .title("Portfolio Management API")
                        .version("v1")
                        .description("Backend APIs for portfolio, holdings, insights, and AI insights")
        );
    }
}