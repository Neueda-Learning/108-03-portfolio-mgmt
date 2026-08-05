package com.neueda.dto;

import java.math.BigDecimal;

public record PositionAsset(
        String assetName,
        int totalQuantity,
        String type,
        BigDecimal totalInvested,
        BigDecimal currentValue,
        BigDecimal profitLoss,
        BigDecimal profitLossPercentage
) {
}
