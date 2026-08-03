package com.neueda.dto;

import com.neueda.model.users;

import java.time.Instant;
import java.util.List;

public record PortfolioResponse(
        users userInfo,
        List<PositionAsset> positions,
        Totals totals,
        Instant asOf
) {
}
