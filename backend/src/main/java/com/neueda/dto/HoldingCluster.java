package com.neueda.dto;

import java.math.BigDecimal;

public record HoldingCluster(
        String ticker,
        String cluster,
        BigDecimal volatility,
        BigDecimal annual_return
) {
}
