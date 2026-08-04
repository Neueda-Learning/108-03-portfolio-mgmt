package com.neueda.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CachedPriceDataResponse(String ticker, PriceData price_data) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PriceData(List<Double> close, List<String> timestamp) {
    }
}

