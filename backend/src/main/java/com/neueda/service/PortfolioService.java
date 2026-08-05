package com.neueda.service;

import com.neueda.dto.AssetTypeData;
import com.neueda.dto.PortfolioResponse;
import com.neueda.dto.PositionAsset;
import com.neueda.dto.Totals;
import com.neueda.model.Assets;
import com.neueda.model.Holdings;
import com.neueda.model.Type;
import com.neueda.model.User;
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
    private final UserService userService;
    private final HoldingsService holdingsService;
    private final AssetService assetService;
    private final TypeService typeService;
    private final int BUY_ACTION = 1;
    private final int SELL_ACTION = 2;

    public PortfolioService(PriceService priceService,
                            UserService userService,
                            HoldingsService holdingsService,
                            AssetService assetService,
                            TypeService typeService) {
        this.priceService = priceService;
        this.userService = userService;
        this.holdingsService = holdingsService;
        this.assetService = assetService;
        this.typeService = typeService;
    }


    public PortfolioResponse getPortfolio(int accountId) {
//        TODO: user user = userService.getUserByAccountId(accountId);
//        TODO: userHoldings = holdingsService.getHoldingsByAccountId(accountId);
        User user = userService.getUserById(accountId);
        List<Holdings> userHoldings = holdingsService.getHoldingsByUserId(accountId);
        List<Type> assetTypes = typeService.getAllTypes();
        HashMap<Type, Double> typeTotalMap= new HashMap<>();
        HashMap<Integer, PositionAsset> positions = new HashMap<>();

        for(Type type : assetTypes) {
            typeTotalMap.put(type, 0.0);
        }

        for (Holdings holding : userHoldings) {
            int asset_id = holding.assetId();
            Assets asset = assetService.getAssetById(asset_id);
            Type type = typeService.getTypeById(asset.typeId());
            float qty = holding.quantity();
            BigDecimal cost = holding.pricePerUnit().multiply(BigDecimal.valueOf(holding.quantity()));

            // Flip sign for SELL
            if (holding.actionId() == SELL_ACTION) { // 2 = SELL
                qty  = -qty;
                cost = cost.negate();
            }
            typeTotalMap.put(type, cost.doubleValue() + typeTotalMap.get(type));

            if (positions.containsKey(asset_id)) {
                BigDecimal totalInvested = positions.get(asset_id).totalInvested()
                        .add(cost);
                int totalQuantity = positions.get(asset_id).totalQuantity() + (int) qty;
                positions.put(asset_id, new PositionAsset(
                        asset.name(),
                        totalQuantity,
                        type.name(),
                        totalInvested,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO, BigDecimal.ZERO
                ));
            } else {
                positions.put(asset_id, new PositionAsset(
                        asset.name(),
                        (int) qty,
                        type.name(),
                        cost,
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
                    position.type(),
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

        List<AssetTypeData> assetTypeDataList = new ArrayList<>();

        for(Map.Entry<Type, Double> entry : typeTotalMap.entrySet()) {
            Type type = entry.getKey();
            double totalInvestedForType = entry.getValue();
            double percentageInvested = totalInvested.compareTo(BigDecimal.ZERO) != 0 ?
                    (totalInvestedForType / totalInvested.doubleValue()) * 100 : 0;
            assetTypeDataList.add(new AssetTypeData(type.name(),
                    BigDecimal.valueOf(percentageInvested)));
        }


        return new PortfolioResponse(
               user,
                new ArrayList<>(positions.values()),
                new Totals(
                        totalInvested,
                        totalCurrentValue,
                        profitLoss,
                        profitLossPercentage
                ),
                Instant.now(),
                assetTypeDataList
        );
    }
}
