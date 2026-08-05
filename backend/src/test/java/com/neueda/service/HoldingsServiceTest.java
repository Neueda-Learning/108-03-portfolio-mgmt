package com.neueda.service;

import com.neueda.model.Action;
import com.neueda.model.Holdings;
import com.neueda.repository.ActionRepository;
import com.neueda.repository.HoldingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HoldingsServiceTest {

    @Mock
    private HoldingRepository holdingRepository;

    @Mock
    private ActionRepository actionRepository;

    @InjectMocks
    private HoldingsService holdingsService;

    private Holdings sampleHolding(int holdingId, float quantity, int actionId) {
        return new Holdings(
                holdingId,
                1,
                10,
                quantity,
                actionId,
                new BigDecimal("100.00"),
                LocalDate.of(2026, 8, 5));
    }

    @Test
    void getAllHoldings_returnsAllHoldingsFromRepository() {
        List<Holdings> holdings = List.of(sampleHolding(1, 10f, 1), sampleHolding(2, 20f, 1));
        when(holdingRepository.findAll()).thenReturn(holdings);

        List<Holdings> result = holdingsService.getAllHoldings();

        assertEquals(2, result.size());
        verify(holdingRepository).findAll();
    }

    @Test
    void getAllHoldings_returnsEmptyListWhenRepositoryEmpty() {
        when(holdingRepository.findAll()).thenReturn(List.of());

        List<Holdings> result = holdingsService.getAllHoldings();

        assertTrue(result.isEmpty());
    }

    @Test
    void getHoldingsByUserId_returnsHoldingsForSpecificUser() {
        when(holdingRepository.findByUserId(1)).thenReturn(List.of(sampleHolding(1, 5f, 1)));

        List<Holdings> result = holdingsService.getHoldingsByUserId(1);

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).userId());
        verify(holdingRepository).findByUserId(1);
    }

    @Test
    void getHoldingsByUserId_returnsEmptyWhenUserHasNoHoldings() {
        when(holdingRepository.findByUserId(99)).thenReturn(List.of());

        List<Holdings> result = holdingsService.getHoldingsByUserId(99);

        assertTrue(result.isEmpty());
    }

    @Test
    void getHoldingById_returnsHoldingWhenFound() {
        Holdings holding = sampleHolding(5, 15f, 1);
        when(holdingRepository.findById(5)).thenReturn(Optional.of(holding));

        Holdings result = holdingsService.getHoldingById(5);

        assertEquals(5, result.holdingId());
        assertEquals(15f, result.quantity());
        verify(holdingRepository).findById(5);
    }

    @Test
    void getHoldingById_throwsNotFoundWhenMissing() {
        when(holdingRepository.findById(404)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsService.getHoldingById(404));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Holding not found: 404"));
    }

    @Test
    void createHolding_savesWhenActionIsBuy() {
        Holdings request = sampleHolding(0, 5f, 1);
        when(actionRepository.findById(1)).thenReturn(Optional.of(new Action(1, "BUY")));
        when(holdingRepository.save(any(Holdings.class))).thenReturn(sampleHolding(10, 5f, 1));

        Holdings result = holdingsService.createHolding(request);

        assertEquals(10, result.holdingId());
        verify(holdingRepository).save(any(Holdings.class));
        verify(holdingRepository, never()).findByUserIdAndAssetId(anyInt(), anyInt());
    }

    @Test
    void createHolding_savesWhenSellQuantityIsWithinNetOwned() {
        Holdings buyHolding = sampleHolding(1, 20f, 1);
        Holdings sellHolding = sampleHolding(2, 3f, 2);
        Holdings request = sampleHolding(0, 10f, 2);

        when(actionRepository.findById(2)).thenReturn(Optional.of(new Action(2, "SELL")));
        when(actionRepository.findAll()).thenReturn(List.of(new Action(1, "BUY"), new Action(2, "SELL")));
        when(holdingRepository.findByUserIdAndAssetId(1, 10)).thenReturn(List.of(buyHolding, sellHolding));
        when(holdingRepository.save(any(Holdings.class))).thenReturn(sampleHolding(11, 10f, 2));

        Holdings result = holdingsService.createHolding(request);

        assertEquals(11, result.holdingId());
        verify(holdingRepository).save(any(Holdings.class));
    }

    @Test
    void createHolding_throwsBadRequestWhenSellExceedsNetOwned() {
        Holdings buyHolding = sampleHolding(1, 20f, 1);
        Holdings sellHolding = sampleHolding(2, 5f, 2);
        Holdings request = sampleHolding(0, 20f, 2);

        when(actionRepository.findById(2)).thenReturn(Optional.of(new Action(2, "SELL")));
        when(actionRepository.findAll()).thenReturn(List.of(new Action(1, "BUY"), new Action(2, "SELL")));
        when(holdingRepository.findByUserIdAndAssetId(1, 10)).thenReturn(List.of(buyHolding, sellHolding));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsService.createHolding(request));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Cannot sell"));
        verify(holdingRepository, never()).save(any(Holdings.class));
    }

    @Test
    void createHolding_savesWhenActionIdNotFound() {
        Holdings request = sampleHolding(0, 5f, 999);
        when(actionRepository.findById(999)).thenReturn(Optional.empty());
        when(holdingRepository.save(any(Holdings.class))).thenReturn(sampleHolding(12, 5f, 999));

        Holdings result = holdingsService.createHolding(request);

        assertEquals(12, result.holdingId());
        verify(holdingRepository).save(any(Holdings.class));
    }

    @Test
    void createHolding_throwsBadRequestWhenSellQuantityIsZero() {
        Holdings request = sampleHolding(0, 0f, 2);

        when(actionRepository.findById(2)).thenReturn(Optional.of(new Action(2, "SELL")));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsService.createHolding(request));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Quantity must be greater than zero"));
    }

    @Test
    void createHolding_throwsBadRequestWhenSellQuantityIsNegative() {
        Holdings request = sampleHolding(0, -5f, 2);

        when(actionRepository.findById(2)).thenReturn(Optional.of(new Action(2, "SELL")));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsService.createHolding(request));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Quantity must be greater than zero"));
    }

    @Test
    void updateHolding_updatesWhenHoldingExists() {
        Holdings request = sampleHolding(0, 25f, 1);
        when(holdingRepository.existsById(5)).thenReturn(true);
        when(holdingRepository.save(any(Holdings.class))).thenReturn(sampleHolding(5, 25f, 1));

        Holdings result = holdingsService.updateHolding(5, request);

        assertEquals(5, result.holdingId());
        assertEquals(25f, result.quantity());
        verify(holdingRepository).save(any(Holdings.class));
    }

    @Test
    void updateHolding_throwsNotFoundWhenHoldingMissing() {
        when(holdingRepository.existsById(5)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsService.updateHolding(5, sampleHolding(0, 1f, 1)));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Holding not found: 5"));
        verify(holdingRepository, never()).save(any(Holdings.class));
    }

    @Test
    void deleteHolding_deletesWhenHoldingExists() {
        when(holdingRepository.existsById(3)).thenReturn(true);

        holdingsService.deleteHolding(3);

        verify(holdingRepository).deleteById(3);
    }

    @Test
    void deleteHolding_throwsNotFoundWhenHoldingMissing() {
        when(holdingRepository.existsById(3)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> holdingsService.deleteHolding(3));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Holding not found: 3"));
        verify(holdingRepository, never()).deleteById(anyInt());
    }
}