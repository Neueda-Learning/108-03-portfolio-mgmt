package com.neueda.service;

import com.neueda.dto.PriceResponse;
import com.neueda.model.FinnhubQuote;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.time.Instant;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PriceServiceV2Test {

    @Mock
    private RestClient client;

    @Mock
    private RestClient.RequestHeadersUriSpec<?> requestHeadersUriSpec;

    @Mock
    private RestClient.RequestHeadersSpec<?> requestHeadersSpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    private PriceServiceV2 service;

    @BeforeEach
    @SuppressWarnings({"rawtypes", "unchecked"})
    void setUp() {
        service = new PriceServiceV2(client, "test-token");
        when(client.get()).thenReturn((RestClient.RequestHeadersUriSpec) requestHeadersUriSpec);
        doReturn(requestHeadersSpec)
                .when((RestClient.RequestHeadersUriSpec) requestHeadersUriSpec)
                .uri(any(Function.class));
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
    }

    @Test
    void getPrice_returnsMappedResponseWithUppercaseTicker() {
        when(responseSpec.body(FinnhubQuote.class))
                .thenReturn(new FinnhubQuote(new BigDecimal("123.45"), new BigDecimal("120.00"), 1722896400L));

        Instant before = Instant.now();
        PriceResponse result = service.getPrice("aapl");
        Instant after = Instant.now();

        assertEquals("AAPL", result.ticker());
        assertEquals(new BigDecimal("123.45"), result.price());
        assertEquals("USD", result.currency());
        assertFalse(result.asof().isBefore(before));
        assertFalse(result.asof().isAfter(after));
    }

    @Test
    void getPrice_buildsUriWithQuotePathSymbolAndToken() {
        when(responseSpec.body(FinnhubQuote.class))
                .thenReturn(new FinnhubQuote(new BigDecimal("100.00"), new BigDecimal("98.50"), 1722896400L));

        service.getPrice("msft");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Function<UriBuilder, URI>> uriFnCaptor = ArgumentCaptor.forClass(Function.class);
        verify((RestClient.RequestHeadersUriSpec) requestHeadersUriSpec).uri(uriFnCaptor.capture());

        UriBuilder uriBuilder = mock(UriBuilder.class);
        URI expectedUri = URI.create("/quote?symbol=msft&token=test-token");
        when(uriBuilder.path("/quote")).thenReturn(uriBuilder);
        when(uriBuilder.queryParam("symbol", "msft")).thenReturn(uriBuilder);
        when(uriBuilder.queryParam("token", "test-token")).thenReturn(uriBuilder);
        when(uriBuilder.build()).thenReturn(expectedUri);

        URI built = uriFnCaptor.getValue().apply(uriBuilder);

        assertEquals(expectedUri, built);
        verify(uriBuilder).path("/quote");
        verify(uriBuilder).queryParam("symbol", "msft");
        verify(uriBuilder).queryParam("token", "test-token");
        verify(uriBuilder).build();
    }

    @Test
    void getPrice_throwsWhenApiBodyIsNull() {
        when(responseSpec.body(FinnhubQuote.class)).thenReturn(null);

        assertThrows(NullPointerException.class, () -> service.getPrice("aapl"));
    }

    @Test
    void getPrice_allowsNullCurrentPriceAndReturnsResponse() {
        when(responseSpec.body(FinnhubQuote.class))
                .thenReturn(new FinnhubQuote(null, new BigDecimal("90.00"), 1722896400L));

        PriceResponse result = service.getPrice("tsla");

        assertEquals("TSLA", result.ticker());
        assertNull(result.price());
        assertEquals("USD", result.currency());
        assertNotNull(result.asof());
    }
}