package com.neueda.service;

import com.neueda.dto.PortfolioResponse;
import com.neueda.dto.PositionAsset;
import com.neueda.dto.Totals;
import com.neueda.model.holdings;
import com.neueda.model.users;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {
//    TODO: Patch this in when ready userService userService;
//    TODO: Patch this in when ready holdingsService holdingsService;
//    TODO: BUY SELLACTION IMPLEMENTATION
    private final PriceService priceService;
    private final int BUY_ACTION = 1;
    private final int SELL_ACTION = 2;

    public PortfolioService(PriceService priceService) {
        this.priceService = priceService;
    }


    public PortfolioResponse getPortfolio(String accountId) {
//        TODO: user user = userService.getUserByAccountId(accountId);
//        TODO: userHoldings = holdingsService.getHoldingsByAccountId(accountId);
        users user = new users(1, "John Doe", "", "");
        List<holdings> userHoldings = new ArrayList<>();
        HashMap<Integer, PositionAsset> positions = new HashMap<>();

        for (holdings holding : userHoldings) {
            int asset_id = holding.asset_id();
            float qty = holding.quantity();
            float cost = holding.quantity() * holding.price_bought();

            // Flip sign for SELL
            if (holding.action_id() == SELL_ACTION) { // 2 = SELL
                qty  = -qty;
                cost = -cost;
            }

            if (positions.containsKey(asset_id)) {
                BigDecimal totalInvested = positions.get(asset_id).totalInvested()
                        .add(BigDecimal.valueOf(cost));
                int totalQuantity = positions.get(asset_id).totalQuantity() + (int) qty;
                positions.put(asset_id, new PositionAsset(
                        "Asset Name Placeholder",
                        totalQuantity,
                        totalInvested,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO, BigDecimal.ZERO
                ));
            } else {
                positions.put(asset_id, new PositionAsset(
                        "Asset Name Placeholder",
                        (int) qty,
                        BigDecimal.valueOf(cost),
                        BigDecimal.ZERO,
                        BigDecimal.ZERO, BigDecimal.ZERO
                ));
            }
        }

        for(Map.Entry<Integer, PositionAsset> entry : positions.entrySet()) {
            int asset_id = entry.getKey();
            PositionAsset position = entry.getValue();
            BigDecimal currentPrice = priceService.getPrice(position.assetName()).price();
            BigDecimal currentValue = currentPrice.multiply(BigDecimal.valueOf(position.totalQuantity()));
            BigDecimal profitLoss = currentValue.subtract(position.totalInvested());
            BigDecimal profitLossPercentage = position.totalInvested().compareTo(BigDecimal.ZERO) != 0 ?
                    profitLoss.divide(position.totalInvested(), BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100)) :
                    BigDecimal.ZERO;

            PositionAsset updatedPosition = new PositionAsset(
                    position.assetName(),
                    position.totalQuantity(),
                    position.totalInvested(),
                    currentValue,
                    profitLoss,
                    profitLossPercentage
            );
            positions.put(asset_id, updatedPosition);
        }

        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalCurrentValue = BigDecimal.ZERO;
        for (PositionAsset position : positions.values()) {
            totalInvested = totalInvested.add(position.totalInvested());
            totalCurrentValue = totalCurrentValue.add(position.currentValue());
        }
        BigDecimal profitLoss = totalCurrentValue.subtract(totalInvested);
        BigDecimal profitLossPercentage = totalInvested.compareTo(BigDecimal.ZERO) != 0 ?
                profitLoss.divide(totalInvested, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100)) :
                BigDecimal.ZERO;
        return new PortfolioResponse(
               user,
                new ArrayList<>(positions.values()),
                new Totals(
                        totalInvested,
                        totalCurrentValue,
                        profitLoss,
                        profitLossPercentage
                ),
                Instant.now()
        );
    }
}

