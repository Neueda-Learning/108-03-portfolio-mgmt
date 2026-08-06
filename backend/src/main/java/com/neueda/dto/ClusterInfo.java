package com.neueda.dto;

import java.math.BigDecimal;

public record ClusterInfo(
        String cluster,
        BigDecimal volatility,
        BigDecimal annual_return
) {
}
