package com.neueda.controller;

import com.neueda.model.Holdings;
import com.neueda.service.HoldingsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class HoldingsControllerTest {

    @Mock
    private HoldingsService holdingsService;

    @InjectMocks
    private HoldingsController holdingsController;

    @Test
    void getAllHoldings_returnsAllHoldingsFromService() {
        List<Holdings> expected = List.of(
                holding(1, 1, 10, 2f, 1, "100.00", LocalDate.of(2026, 8, 1)),
                holding(2, 1, 20, 1f, 2, "90.00", LocalDate.of(2026, 8, 2))
        );
        when(holdingsService.getAllHoldings()).thenReturn(expected);

        List<Holdings> actual = holdingsController.getAllHoldings();

        assertEquals(expected, actual);
        verify(holdingsService).getAllHoldings();
    }

    @Test
    void getHoldingsByUserId_returnsUserHoldingsFromService() {
        List<Holdings> expected = List.of(
                holding(1, 7, 10, 2f, 1, "100.00", LocalDate.of(2026, 8, 1))
        );
        when(holdingsService.getHoldingsByUserId(7)).thenReturn(expected);

        List<Holdings> actual = holdingsController.getHoldingsByUserId(7);

        assertEquals(expected, actual);
        verify(holdingsService).getHoldingsByUserId(7);
    }

    @Test
    void getHoldingById_returnsHoldingFromService() {
        Holdings expected = holding(5, 3, 11, 4f, 1, "50.00", LocalDate.of(2026, 8, 3));
        when(holdingsService.getHoldingById(5)).thenReturn(expected);

        Holdings actual = holdingsController.getHoldingById(5);

        assertEquals(expected, actual);
        verify(holdingsService).getHoldingById(5);
    }

    @Test
    void getHoldingById_propagatesNotFoundFromService() {
        when(holdingsService.getHoldingById(404))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Holding not found: 404"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsController.getHoldingById(404));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void createHolding_returnsCreatedResponseWithLocationAndBody() {
        Holdings request = holding(0, 1, 10, 2f, 1, "100.00", LocalDate.of(2026, 8, 1));
        Holdings created = holding(15, 1, 10, 2f, 1, "100.00", LocalDate.of(2026, 8, 1));
        when(holdingsService.createHolding(request)).thenReturn(created);

        ResponseEntity<?> response = holdingsController.createHolding(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(created, response.getBody());
        assertEquals(URI.create("/api/holdings/15"), response.getHeaders().getLocation());
        verify(holdingsService).createHolding(request);
    }

    @Test
    void createHolding_propagatesBadRequestFromService() {
        Holdings request = holding(0, 1, 10, 100f, 2, "100.00", LocalDate.of(2026, 8, 2));
        when(holdingsService.createHolding(request))
                .thenThrow(new ResponseStatusException(BAD_REQUEST, "Cannot sell more than available"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsController.createHolding(request));

        assertEquals(BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void updateHolding_returnsUpdatedHoldingFromService() {
        Holdings request = holding(0, 1, 10, 3f, 1, "110.00", LocalDate.of(2026, 8, 5));
        Holdings updated = holding(9, 1, 10, 3f, 1, "110.00", LocalDate.of(2026, 8, 5));
        when(holdingsService.updateHolding(9, request)).thenReturn(updated);

        Holdings actual = holdingsController.updateHolding(9, request);

        assertEquals(updated, actual);
        verify(holdingsService).updateHolding(9, request);
    }

    @Test
    void updateHolding_propagatesNotFoundFromService() {
        Holdings request = holding(0, 1, 10, 3f, 1, "110.00", LocalDate.of(2026, 8, 5));
        when(holdingsService.updateHolding(77, request))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Holding not found: 77"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsController.updateHolding(77, request));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deleteHolding_returnsNoContentWhenServiceDeletes() {
        doNothing().when(holdingsService).deleteHolding(3);

        ResponseEntity<?> response = holdingsController.deleteHolding(3);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(holdingsService).deleteHolding(3);
    }

    @Test
    void deleteHolding_propagatesNotFoundFromService() {
        doThrow(new ResponseStatusException(NOT_FOUND, "Holding not found: 44"))
                .when(holdingsService).deleteHolding(44);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsController.deleteHolding(44));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    private Holdings holding(int holdingId, int userId, int assetId, float quantity, int actionId,
                             String pricePerUnit, LocalDate transactionDate) {
        return new Holdings(
                holdingId,
                userId,
                assetId,
                quantity,
                actionId,
                new BigDecimal(pricePerUnit),
                transactionDate
        );
    }
}