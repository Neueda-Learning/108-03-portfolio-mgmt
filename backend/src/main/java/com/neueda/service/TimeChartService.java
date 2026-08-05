package com.neueda.service;

import com.neueda.dto.Point;
import com.neueda.model.Holdings;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class TimeChartService {

    private static final int SELL_ACTION = 2;
    private final HoldingsService holdingsService;

    public TimeChartService(HoldingsService holdingsService) {
        this.holdingsService = holdingsService;
    }

    public List<Point> getTotalInvestedChart(int accountId) {
        List<Holdings> holdings = holdingsService.getHoldingsByUserId(accountId);

        // Aggregate net cash flow by transaction day (BUY adds invested capital, SELL reduces it).
        Map<LocalDate, BigDecimal> perDayDelta = new TreeMap<>();
        for (Holdings holding : holdings) {
            BigDecimal amount = holding.pricePerUnit().multiply(BigDecimal.valueOf(holding.quantity()));
            if (holding.actionId() == SELL_ACTION) {
                amount = amount.negate();
            }

            perDayDelta.merge(holding.transactionDate(), amount, BigDecimal::add);
        }

        List<Point> chart = new ArrayList<>();
        BigDecimal runningTotal = BigDecimal.ZERO;
        for (Map.Entry<LocalDate, BigDecimal> entry : perDayDelta.entrySet()) {
            runningTotal = runningTotal.add(entry.getValue());
            chart.add(new Point(entry.getKey(), runningTotal));
        }

        chart.sort(Comparator.comparing(Point::date));
        return chart;
    }
}
