package com.neueda.controller;

import com.neueda.dto.AssetTypeData;
import com.neueda.dto.PortfolioResponse;
import com.neueda.dto.PositionAsset;
import com.neueda.dto.Totals;
import com.neueda.model.User;
import com.neueda.service.PortfolioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class PortfolioControllerTest {

    @Mock
    private PortfolioService portfolioService;

    @InjectMocks
    private PortfolioController portfolioController;

    @Test
    void getPortfolio_parsesNumericAccountIdAndReturnsServiceResponse() {
        PortfolioResponse expected = sampleResponse();
        when(portfolioService.getPortfolio(123)).thenReturn(expected);

        PortfolioResponse actual = portfolioController.getPortfolio("123");

        assertEquals(expected, actual);
        verify(portfolioService).getPortfolio(123);
    }

    @Test
    void getPortfolio_acceptsLeadingZerosAndDelegatesParsedInt() {
        PortfolioResponse expected = sampleResponse();
        when(portfolioService.getPortfolio(7)).thenReturn(expected);

        PortfolioResponse actual = portfolioController.getPortfolio("007");

        assertEquals(expected, actual);
        verify(portfolioService).getPortfolio(7);
    }

    @Test
    void getPortfolio_propagatesServiceException() {
        when(portfolioService.getPortfolio(99))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "User not found: 99"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> portfolioController.getPortfolio("99"));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void getPortfolio_throwsNumberFormatExceptionForNonNumericAccountId() {
        assertThrows(NumberFormatException.class, () -> portfolioController.getPortfolio("abc"));
        verifyNoInteractions(portfolioService);
    }

    @Test
    void getPortfolio_throwsNumberFormatExceptionForBlankAccountId() {
        assertThrows(NumberFormatException.class, () -> portfolioController.getPortfolio(" "));
        verifyNoInteractions(portfolioService);
    }

    private PortfolioResponse sampleResponse() {
        User user = new User(1, "Pranav", "Menon", "pranav@example.com");
        List<PositionAsset> positions = List.of(
                new PositionAsset(
                        "AAPL",
                        2,
                        "STOCK",
                        new BigDecimal("200.00"),
                        new BigDecimal("210.00"),
                        new BigDecimal("10.00"),
                        new BigDecimal("5.00")
                )
        );
        Totals totals = new Totals(
                new BigDecimal("200.00"),
                new BigDecimal("210.00"),
                new BigDecimal("10.00"),
                new BigDecimal("5.00")
        );
        List<AssetTypeData> assets = List.of(
                new AssetTypeData("STOCK", new BigDecimal("100.00"))
        );

        return new PortfolioResponse(user, positions, totals, Instant.parse("2026-08-06T10:00:00Z"), assets);
    }
}