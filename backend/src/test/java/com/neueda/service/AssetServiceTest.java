package com.neueda.service;

import com.neueda.model.Assets;
import com.neueda.repository.AssetRepository;
import com.neueda.repository.AssetTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @Mock
    private AssetTypeRepository typeRepository;

    @InjectMocks
    private AssetService assetService;

    @Test
    void getAllAssets_returnsAllAssetsFromRepository() {
        List<Assets> assets = List.of(new Assets(1, "AAPL", 1), new Assets(2, "US10Y", 2));
        when(assetRepository.findAll()).thenReturn(assets);

        List<Assets> result = assetService.getAllAssets();

        assertEquals(2, result.size());
        assertEquals("AAPL", result.get(0).name());
        verify(assetRepository).findAll();
    }

    @Test
    void getAllAssets_returnsEmptyListWhenRepositoryEmpty() {
        when(assetRepository.findAll()).thenReturn(List.of());

        List<Assets> result = assetService.getAllAssets();

        assertTrue(result.isEmpty());
    }

    @Test
    void getAssetById_returnsAssetWhenFound() {
        when(assetRepository.findById(1)).thenReturn(Optional.of(new Assets(1, "AAPL", 1)));

        Assets result = assetService.getAssetById(1);

        assertEquals(1, result.assetId());
        assertEquals("AAPL", result.name());
        verify(assetRepository).findById(1);
    }

    @Test
    void getAssetById_throwsNotFoundWhenMissing() {
        when(assetRepository.findById(404)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetService.getAssetById(404));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Asset not found: 404"));
    }

    @Test
    void createAsset_setsIdToZeroBeforeSave() {
        Assets request = new Assets(99, "MSFT", 1);
        when(typeRepository.existsById(1)).thenReturn(true);
        when(assetRepository.save(any(Assets.class))).thenReturn(new Assets(10, "MSFT", 1));

        Assets result = assetService.createAsset(request);

        assertEquals(10, result.assetId());
        assertEquals("MSFT", result.name());
        verify(assetRepository).save(new Assets(0, "MSFT", 1));
    }

    @Test
    void createAsset_propagatesRepositoryException() {
        when(typeRepository.existsById(1)).thenReturn(true);
        when(assetRepository.save(any(Assets.class))).thenThrow(new RuntimeException("insert failed"));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> assetService.createAsset(new Assets(0, "MSFT", 1)));

        assertTrue(ex.getMessage().contains("insert failed"));
    }

    @Test
    void createAsset_throwsNotFoundWhenTypeDoesNotExist() {
        Assets request = new Assets(0, "MSFT", 99);
        when(typeRepository.existsById(99)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetService.createAsset(request));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Type not found: 99"));
        verify(assetRepository, never()).save(any(Assets.class));
    }

    @Test
    void updateAsset_updatesWhenAssetExists() {
        Assets request = new Assets(0, "GOOGL", 1);
        when(assetRepository.existsById(5)).thenReturn(true);
        when(assetRepository.save(any(Assets.class))).thenReturn(new Assets(5, "GOOGL", 1));

        Assets result = assetService.updateAsset(5, request);

        assertEquals(5, result.assetId());
        assertEquals("GOOGL", result.name());
        verify(assetRepository).save(new Assets(5, "GOOGL", 1));
    }

    @Test
    void updateAsset_throwsNotFoundWhenMissing() {
        when(assetRepository.existsById(5)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetService.updateAsset(5, new Assets(0, "GOOGL", 1)));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Asset not found: 5"));
        verify(assetRepository, never()).save(any(Assets.class));
    }

    @Test
    void deleteAsset_deletesWhenAssetExists() {
        when(assetRepository.existsById(3)).thenReturn(true);

        assetService.deleteAsset(3);

        verify(assetRepository).deleteById(3);
    }

    @Test
    void deleteAsset_throwsNotFoundWhenMissing() {
        when(assetRepository.existsById(3)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> assetService.deleteAsset(3));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Asset not found: 3"));
        verify(assetRepository, never()).deleteById(anyInt());
    }
}