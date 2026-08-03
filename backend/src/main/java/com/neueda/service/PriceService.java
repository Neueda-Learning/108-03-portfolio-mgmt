package com.neueda.service;

import com.neueda.dto.PriceResponse;
import com.neueda.dto.YahooChartResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class PriceService {
    private final RestClient client;

    public PriceService(RestClient yahooRestClient) {
        this.client = yahooRestClient;
    }

    public PriceResponse getPrice(String ticker) {
        var meta = fetch(ticker, "1d").chart().result().get(0).meta();
        return new PriceResponse(
                meta.symbol(),
                BigDecimal.valueOf(meta.regularMarketPrice()),
                meta.currency(),
                Instant.now()
        );
    }

    private YahooChartResponse fetch(String ticker, String range) {
        return client.get()
                .uri("/v8/finance/chart/{ticker}?range={range}&interval=1d", ticker, range)
                .retrieve()
                .body(YahooChartResponse.class);
    }
}
