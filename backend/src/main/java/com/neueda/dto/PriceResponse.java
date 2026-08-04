package com.neueda.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PriceResponse(String ticker, BigDecimal price, String currency, Instant asof) {
}
