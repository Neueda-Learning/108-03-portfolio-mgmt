package com.neueda.service;

import com.neueda.dto.Point;
import com.neueda.model.Holdings;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TimeChartServiceTest {

    @Mock
    private HoldingsService holdingsService;

    @InjectMocks
    private TimeChartService timeChartService;

    @Test
    void getTotalInvestedChart_returnsEmptyWhenNoHoldings() {
        when(holdingsService.getHoldingsByUserId(1)).thenReturn(List.of());

        List<Point> result = timeChartService.getTotalInvestedChart(1);

        assertTrue(result.isEmpty());
        verify(holdingsService).getHoldingsByUserId(1);
    }

    @Test
    void getTotalInvestedChart_returnsSinglePointForSingleBuy() {
        Holdings buy = holding(1, 1, 10, 2f, 1, "10.00", LocalDate.of(2026, 8, 1));
        when(holdingsService.getHoldingsByUserId(1)).thenReturn(List.of(buy));

        List<Point> result = timeChartService.getTotalInvestedChart(1);

        assertEquals(1, result.size());
        assertEquals(LocalDate.of(2026, 8, 1), result.get(0).date());
        assertEquals(new BigDecimal("20.000"), result.get(0).close());
    }

    @Test
    void getTotalInvestedChart_mergesSameDayBuysAndSellsIntoNetDelta() {
        List<Holdings> holdings = List.of(
                holding(1, 7, 10, 3f, 1, "10.00", LocalDate.of(2026, 8, 2)), // +30
                holding(2, 7, 10, 1f, 2, "8.00", LocalDate.of(2026, 8, 2)),  // -8
                holding(3, 7, 10, 2f, 1, "5.00", LocalDate.of(2026, 8, 2))   // +10
        );
        when(holdingsService.getHoldingsByUserId(7)).thenReturn(holdings);

        List<Point> result = timeChartService.getTotalInvestedChart(7);

        assertEquals(1, result.size());
        assertEquals(LocalDate.of(2026, 8, 2), result.get(0).date());
        assertEquals(new BigDecimal("32.000"), result.get(0).close());
    }

    @Test
    void getTotalInvestedChart_buildsCumulativeChartAcrossDaysInDateOrder() {
        List<Holdings> holdings = List.of(
                holding(1, 9, 10, 2f, 1, "5.00", LocalDate.of(2026, 8, 3)),  // +10
                holding(2, 9, 10, 3f, 1, "4.00", LocalDate.of(2026, 8, 1)),  // +12
                holding(3, 9, 10, 1f, 2, "2.00", LocalDate.of(2026, 8, 2))   // -2
        );
        when(holdingsService.getHoldingsByUserId(9)).thenReturn(holdings);

        List<Point> result = timeChartService.getTotalInvestedChart(9);

        assertEquals(3, result.size());

        assertEquals(LocalDate.of(2026, 8, 1), result.get(0).date());
        assertEquals(new BigDecimal("12.000"), result.get(0).close());

        assertEquals(LocalDate.of(2026, 8, 2), result.get(1).date());
        assertEquals(new BigDecimal("10.000"), result.get(1).close());

        assertEquals(LocalDate.of(2026, 8, 3), result.get(2).date());
        assertEquals(new BigDecimal("20.000"), result.get(2).close());
    }

    @Test
    void getTotalInvestedChart_treatsActionIdTwoAsSellAndSubtractsAmount() {
        List<Holdings> holdings = List.of(
                holding(1, 5, 10, 5f, 1, "10.00", LocalDate.of(2026, 8, 1)), // +50
                holding(2, 5, 10, 2f, 2, "10.00", LocalDate.of(2026, 8, 2))  // -20
        );
        when(holdingsService.getHoldingsByUserId(5)).thenReturn(holdings);

        List<Point> result = timeChartService.getTotalInvestedChart(5);

        assertEquals(2, result.size());
        assertEquals(new BigDecimal("50.000"), result.get(0).close());
        assertEquals(new BigDecimal("30.000"), result.get(1).close());
    }

    private Holdings holding(int holdingId, int userId, int assetId, float quantity, int actionId,
                             String pricePerUnit, LocalDate date) {
        return new Holdings(
                holdingId,
                userId,
                assetId,
                quantity,
                actionId,
                new BigDecimal(pricePerUnit),
                date
        );
    }
}