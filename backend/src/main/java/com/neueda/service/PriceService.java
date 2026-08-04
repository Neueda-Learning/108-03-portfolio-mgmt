package com.neueda.service;

import com.neueda.dto.CachedPriceDataResponse;
import com.neueda.dto.PriceResponse;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class PriceService {
    private static final DateTimeFormatter API_TIMESTAMP_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss", Locale.US);

    private final RestClient client;

    public PriceService(@Qualifier("priceApiRestClient") RestClient client) {
        this.client = client;
    }

    public PriceResponse getPrice(String ticker) {
        CachedPriceDataResponse response = fetch();
        List<Double> closePrices = response.price_data().close();
        List<String> timestamps = response.price_data().timestamp();

        if (closePrices == null || closePrices.isEmpty()) {
            throw new IllegalStateException("No cached prices available for ticker: " + ticker);
        }

        int latestIndex = closePrices.size() - 1;
        Double latestClose = closePrices.get(latestIndex);
        if (latestClose == null) {
            throw new IllegalStateException("Latest cached price is missing for ticker: " + ticker);
        }

        Instant asOf = Instant.now();
        if (timestamps != null && timestamps.size() > latestIndex && timestamps.get(latestIndex) != null) {
            asOf = LocalDateTime.parse(timestamps.get(latestIndex), API_TIMESTAMP_FORMATTER).toInstant(ZoneOffset.UTC);
        }

        return new PriceResponse(
                ticker.toUpperCase(Locale.ROOT),
                BigDecimal.valueOf(latestClose),
                "USD",
                asOf
        );
    }

    private CachedPriceDataResponse fetch() {
        CachedPriceDataResponse response = client.get()
                .uri("/cachedPriceData")
                .retrieve()
                .body(CachedPriceDataResponse.class);

        if (response == null || response.price_data() == null) {
            throw new IllegalStateException("Cached price API returned an empty response");
        }

        return response;
    }
}
