package com.neueda.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
public class RestClientConfig {
    @Bean
    @Qualifier("priceApiRestClientV1")
    RestClient priceApiRestClient(@Value("${price.api.base.url}") String baseUrl) {
        return RestClient.builder().baseUrl(baseUrl).build();
    }

    @Bean
    @Qualifier("priceApiRestClientV2")
    RestClient priceApiRestClientV2(@Value("${finnhub.api.base.url}") String baseUrl) {
        return RestClient.builder().baseUrl(baseUrl).build();
    }
}
