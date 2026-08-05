package com.neueda.dto;

import com.neueda.model.User;

import java.time.Instant;
import java.util.List;

public record PortfolioResponse(
        User userInfo,
        List<PositionAsset> positions,
        Totals totals,
        Instant asOf,
        List<AssetTypeData> assets
) {
}
