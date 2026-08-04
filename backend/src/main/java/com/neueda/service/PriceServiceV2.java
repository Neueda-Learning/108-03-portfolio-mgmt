package com.neueda.service;

import com.neueda.dto.CachedPriceDataResponse;
import com.neueda.dto.PriceResponse;
import com.neueda.model.FinnhubQuote;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import org.springframework.web.client.RestClient;

import java.time.Instant;

@Service
public class PriceServiceV2 {
    private final RestClient client;
    private final String API_TOKEN;

    public PriceServiceV2(@Qualifier("priceApiRestClientV2") RestClient client,
                          @Value("${finnhub.api.key}") String apiToken) {
        this.client = client;
        this.API_TOKEN = apiToken;
    }

    public PriceResponse getPrice(String ticker){
        FinnhubQuote response = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/quote")
                        .queryParam("symbol", ticker)
                        .queryParam("token", API_TOKEN)
                        .build())
                .retrieve()
                .body(FinnhubQuote.class);
        System.out.println(response);
        return new PriceResponse(
                ticker.toUpperCase(),
                response.currentPrice(),
                "USD",
                Instant.now()
        );
    }
}
