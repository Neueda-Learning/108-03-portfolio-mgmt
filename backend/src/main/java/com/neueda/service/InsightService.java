package com.neueda.service;

import com.neueda.dto.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InsightService {
    private final PortfolioService portfolioService;
    private final ClusterCatalog cc;

    public InsightService(PortfolioService portfolioService, ClusterCatalog clusterCatalog) {
        this.portfolioService = portfolioService;
        this.cc = clusterCatalog;
    }

    public InsightsResponse getInsights(int accountId) {
        PortfolioResponse res = portfolioService.getPortfolio(accountId);
        List<PositionAsset> positionAssetList = res.positions();
        List<HoldingCluster> hc = new ArrayList<>();

        for (PositionAsset ps : positionAssetList) {
            Optional<ClusterInfo> a = cc.get(ps.assetName());

            String clusterName;
            BigDecimal volatility;
            BigDecimal annualReturn;
            if (a.isPresent()) {
                clusterName = a.get().cluster();
                volatility = a.get().volatility();
                annualReturn = a.get().annual_return();
            } else {
                clusterName = "Unknown";
                volatility = BigDecimal.ZERO;
                annualReturn = BigDecimal.ZERO;
            }
            hc.add(new HoldingCluster(ps.assetName(), clusterName, volatility, annualReturn));
        }

        return new InsightsResponse(hc, Map.of(), "");
    }
}
