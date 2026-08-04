package com.neueda.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FinnhubQuote(
        @JsonProperty("c") BigDecimal currentPrice,
        @JsonProperty("pc") BigDecimal previousClosePrice,
        @JsonProperty("t") Long timestamp
) {
}
