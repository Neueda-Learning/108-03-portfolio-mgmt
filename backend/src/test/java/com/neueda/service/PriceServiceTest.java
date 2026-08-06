package com.neueda.service;

import com.neueda.dto.CachedPriceDataResponse;
import com.neueda.dto.PriceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PriceServiceTest {

    @Mock
    private RestClient restClient;

    @Mock
    private RestClient.RequestHeadersUriSpec<?> requestHeadersUriSpec;

    @Mock
    private RestClient.RequestHeadersSpec<?> requestHeadersSpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    private PriceService priceService;

    @BeforeEach
    @SuppressWarnings({"rawtypes", "unchecked"})
    void setUp() {
        priceService = new PriceService(restClient);
        when(restClient.get()).thenReturn((RestClient.RequestHeadersUriSpec) requestHeadersUriSpec);
        doReturn(requestHeadersSpec).when((RestClient.RequestHeadersUriSpec) requestHeadersUriSpec).uri("/cachedPriceData");
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
    }

    @Test
    void getPrice_returnsLatestPriceAndUppercaseTicker() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(responseWith(
                List.of(101.1, 102.2, 103.3),
                List.of("2026-08-06 10:00:00", "2026-08-06 11:00:00", "2026-08-06 12:00:00")
        ));

        PriceResponse result = priceService.getPrice("aapl");

        assertEquals("AAPL", result.ticker());
        assertEquals(new BigDecimal("103.3"), result.price());
        assertEquals("USD", result.currency());
        assertEquals(Instant.parse("2026-08-06T12:00:00Z"), result.asof());
    }

    @Test
    void getPrice_usesNowWhenTimestampListIsNull() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(responseWith(List.of(55.5), null));

        Instant before = Instant.now();
        PriceResponse result = priceService.getPrice("msft");
        Instant after = Instant.now();

        assertFalse(result.asof().isBefore(before));
        assertFalse(result.asof().isAfter(after));
    }

    @Test
    void getPrice_usesNowWhenLatestTimestampIsMissing() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(responseWith(
                List.of(10.0, 20.0),
                List.of("2026-08-06 10:00:00")
        ));

        Instant before = Instant.now();
        PriceResponse result = priceService.getPrice("goog");
        Instant after = Instant.now();

        assertFalse(result.asof().isBefore(before));
        assertFalse(result.asof().isAfter(after));
        assertEquals(new BigDecimal("20.0"), result.price());
    }

    @Test
    void getPrice_throwsWhenApiResponseIsNull() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(null);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> priceService.getPrice("aapl"));

        assertEquals("Cached price API returned an empty response", ex.getMessage());
    }

    @Test
    void getPrice_throwsWhenPriceDataIsNull() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(new CachedPriceDataResponse("AAPL", null));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> priceService.getPrice("aapl"));

        assertEquals("Cached price API returned an empty response", ex.getMessage());
    }

    @Test
    void getPrice_throwsWhenClosePricesListIsNull() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(responseWith(null, List.of("2026-08-06 10:00:00")));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> priceService.getPrice("aapl"));

        assertEquals("No cached prices available for ticker: aapl", ex.getMessage());
    }

    @Test
    void getPrice_throwsWhenClosePricesListIsEmpty() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(responseWith(List.of(), List.of()));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> priceService.getPrice("aapl"));

        assertEquals("No cached prices available for ticker: aapl", ex.getMessage());
    }

    @Test
    void getPrice_throwsWhenLatestClosePriceIsNull() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(responseWith(
                java.util.Arrays.asList(10.0, null),
                List.of("2026-08-06 10:00:00", "2026-08-06 11:00:00")
        ));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> priceService.getPrice("aapl"));

        assertEquals("Latest cached price is missing for ticker: aapl", ex.getMessage());
    }

    @Test
    void getPrice_throwsWhenLatestTimestampHasInvalidFormat() {
        when(responseSpec.body(CachedPriceDataResponse.class)).thenReturn(responseWith(
                List.of(11.0),
                List.of("08/06/2026 11:00")
        ));

        assertThrows(RuntimeException.class, () -> priceService.getPrice("aapl"));
    }

    private CachedPriceDataResponse responseWith(List<Double> close, List<String> timestamps) {
        return new CachedPriceDataResponse("AAPL", new CachedPriceDataResponse.PriceData(close, timestamps));
    }
}