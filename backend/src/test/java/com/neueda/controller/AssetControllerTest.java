package com.neueda.controller;

import com.neueda.model.Assets;
import com.neueda.service.AssetService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class AssetControllerTest {

    @Mock
    private AssetService assetService;

    @InjectMocks
    private AssetController assetController;

    @Test
    void getAllAssets_returnsAllAssetsFromService() {
        List<Assets> expected = List.of(
                new Assets(1, "AAPL", 1),
                new Assets(2, "US10Y", 2)
        );
        when(assetService.getAllAssets()).thenReturn(expected);

        List<Assets> actual = assetController.getAllAssets();

        assertEquals(expected, actual);
        verify(assetService).getAllAssets();
    }

    @Test
    void getAssetById_returnsAssetFromService() {
        Assets expected = new Assets(7, "MSFT", 1);
        when(assetService.getAssetById(7)).thenReturn(expected);

        Assets actual = assetController.getAssetById(7);

        assertEquals(expected, actual);
        verify(assetService).getAssetById(7);
    }

    @Test
    void getAssetById_propagatesNotFoundFromService() {
        when(assetService.getAssetById(99))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Asset not found: 99"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetController.getAssetById(99));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void createAsset_returnsCreatedResponseWithLocationAndBody() {
        Assets request = new Assets(0, "AAPL", 1);
        Assets created = new Assets(10, "AAPL", 1);
        when(assetService.createAsset(request)).thenReturn(created);

        ResponseEntity<?> response = assetController.createAsset(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(created, response.getBody());
        assertEquals(URI.create("/api/assets/10"), response.getHeaders().getLocation());
        verify(assetService).createAsset(request);
    }

    @Test
    void createAsset_propagatesNotFoundWhenTypeMissing() {
        Assets request = new Assets(0, "AAPL", 999);
        when(assetService.createAsset(request))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Type not found: 999"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetController.createAsset(request));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void updateAsset_returnsUpdatedAssetFromService() {
        Assets request = new Assets(0, "GOOGL", 1);
        Assets updated = new Assets(5, "GOOGL", 1);
        when(assetService.updateAsset(5, request)).thenReturn(updated);

        Assets actual = assetController.updateAsset(5, request);

        assertEquals(updated, actual);
        verify(assetService).updateAsset(5, request);
    }

    @Test
    void updateAsset_propagatesNotFoundFromService() {
        Assets request = new Assets(0, "GOOGL", 1);
        when(assetService.updateAsset(77, request))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Asset not found: 77"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetController.updateAsset(77, request));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deleteAsset_returnsNoContentWhenServiceDeletes() {
        doNothing().when(assetService).deleteAsset(3);

        ResponseEntity<?> response = assetController.deleteAsset(3);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(assetService).deleteAsset(3);
    }

    @Test
    void deleteAsset_propagatesNotFoundFromService() {
        doThrow(new ResponseStatusException(NOT_FOUND, "Asset not found: 44"))
                .when(assetService).deleteAsset(44);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetController.deleteAsset(44));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }
}