package com.neueda.dto;

import java.math.BigDecimal;

public record Totals(
        BigDecimal invested,
        BigDecimal currentValue,
        BigDecimal profitLoss,
        BigDecimal profitLossPercentage
) {
}
