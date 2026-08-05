package com.neueda.service;

import com.neueda.dto.PortfolioResponse;
import com.neueda.dto.PriceResponse;
import com.neueda.model.Assets;
import com.neueda.model.Holdings;
import com.neueda.model.Type;
import com.neueda.model.User;
import com.neueda.dto.Totals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {
    @Mock
    private PriceServiceV2 priceServiceV2;

    @Mock
    private UserService userService;

    @Mock
    private HoldingsService holdingsService;

    @Mock
    private AssetService assetService;

    @Mock
    private TypeService typeService;

    private PortfolioService service;

    @BeforeEach
    void setUp() {
        service = new PortfolioService(priceServiceV2, userService, holdingsService, assetService, typeService);
    }


    @Test
    void getPortfolio_returnsZeroTotalHoldingsWhenNoHolding() {
        int accountId = 1;
        User user = new User(1, "John", "Doe", "");
        Type stock = new Type(1, "Stock");

        when(userService.getUserById(accountId)).thenReturn(user);
        when(holdingsService.getHoldingsByUserId(accountId)).thenReturn(List.of());
        when(typeService.getAllTypes()).thenReturn(List.of(stock));

        PortfolioResponse response = service.getPortfolio(accountId);

        assertEquals(user, response.userInfo());
        assertEquals(BigDecimal.ZERO, response.totals().invested());
        assertEquals(BigDecimal.ZERO, response.totals().currentValue());

        assertEquals(BigDecimal.ZERO, response.totals().invested());
        assertEquals(BigDecimal.ZERO, response.totals().currentValue());
        assertEquals(BigDecimal.ZERO, response.totals().profitLoss());
        assertEquals(BigDecimal.ZERO, response.totals().profitLossPercentage());

        assertEquals(1, response.assets().size());
        assertEquals("Stock", response.assets().get(0).assetName());
        assertEquals(0, response.assets().get(0).percentageInvested().compareTo(BigDecimal.ZERO));
    }

    @Test
    void singleBuy_CreatesOnePosition_WithCurrectTotals(){
        int accountId = 1;
        User user = new User(1, "John", "Doe", "");
        Type stock = new Type(1, "Stock");
        List<Holdings> holdings = List.of(new Holdings(1, 1, 1, 1, 1, BigDecimal.valueOf(100), LocalDate.now()));

        when(userService.getUserById(accountId)).thenReturn(user);
        when(holdingsService.getHoldingsByUserId(accountId)).thenReturn(holdings);
        when(typeService.getAllTypes()).thenReturn(List.of(stock));
        when(assetService.getAssetById(1)).thenReturn(new Assets(1, "AAPL", 1));
        when(typeService.getTypeById(1)).thenReturn(new Type(1, "Stock"));
        when(priceServiceV2.getPrice("AAPL"))
                .thenReturn(new PriceResponse("AAPL", BigDecimal.valueOf(150), "USD", Instant.now()));

        PortfolioResponse response = service.getPortfolio(accountId);

        assertEquals(user, response.userInfo());
        assertThat(response.totals().invested()).isEqualByComparingTo("100");
        assertThat(response.totals().currentValue()).isEqualByComparingTo("150");
        assertThat(response.totals().profitLoss()).isEqualByComparingTo("50");
    }

    @Test
    void singleBuyAndSell_CreatesOnePosition_WithCurrectTotals(){
        int accountId = 1;
        User user = new User(1, "John", "Doe", "");
        Type stock = new Type(1, "Stock");
        List<Holdings> holdings = List.of(new Holdings(1, 1, 1, 10, 1, BigDecimal.valueOf(100), LocalDate.now()),
                new Holdings(2, 1, 1, 5, 2, BigDecimal.valueOf(75), LocalDate.now()));

        when(userService.getUserById(accountId)).thenReturn(user);
        when(holdingsService.getHoldingsByUserId(accountId)).thenReturn(holdings);
        when(typeService.getAllTypes()).thenReturn(List.of(stock));
        when(assetService.getAssetById(1)).thenReturn(new Assets(1, "AAPL", 1));
        when(typeService.getTypeById(1)).thenReturn(new Type(1, "Stock"));
        when(priceServiceV2.getPrice("AAPL"))
                .thenReturn(new PriceResponse("AAPL", BigDecimal.valueOf(150), "USD", Instant.now()));

        PortfolioResponse response = service.getPortfolio(accountId);

        assertEquals(user, response.userInfo());
        assertThat(response.totals().invested()).isEqualByComparingTo("625");
        assertThat(response.totals().currentValue()).isEqualByComparingTo("750");
        assertThat(response.totals().profitLoss()).isEqualByComparingTo("125");
    }
}