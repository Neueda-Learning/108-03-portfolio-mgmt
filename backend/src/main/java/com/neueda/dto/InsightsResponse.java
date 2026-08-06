package com.neueda.dto;

import java.util.List;
import java.util.Map;

public record InsightsResponse(
        List<HoldingCluster> holdingClusters,
        Map<String, Integer> clusterCounts,
        String summary
) {
}
