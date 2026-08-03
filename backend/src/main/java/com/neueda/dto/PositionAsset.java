package com.neueda.dto;

import java.math.BigDecimal;

public record PositionAsset(
        String assetName,
        int totalQuantity,
        BigDecimal totalInvested,
        BigDecimal currentValue,
        BigDecimal profitLoss,
        BigDecimal profitLossPercentage
) {
}
