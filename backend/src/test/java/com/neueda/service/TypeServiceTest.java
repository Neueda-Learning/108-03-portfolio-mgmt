package com.neueda.service;

import com.neueda.model.Type;
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
class TypeServiceTest {

    @Mock
    private AssetTypeRepository typeRepository;

    @InjectMocks
    private TypeService typeService;

    @Test
    void getAllTypes_returnsAllTypesFromRepository() {
        List<Type> types = List.of(new Type(1, "STOCK"), new Type(2, "BOND"));
        when(typeRepository.findAll()).thenReturn(types);

        List<Type> result = typeService.getAllTypes();

        assertEquals(2, result.size());
        assertEquals("STOCK", result.get(0).name());
        verify(typeRepository).findAll();
    }

    @Test
    void getTypeById_returnsTypeWhenFound() {
        when(typeRepository.findById(1)).thenReturn(Optional.of(new Type(1, "STOCK")));

        Type result = typeService.getTypeById(1);

        assertEquals(1, result.typeId());
        assertEquals("STOCK", result.name());
        verify(typeRepository).findById(1);
    }

    @Test
    void getTypeById_throwsNotFoundWhenTypeMissing() {
        when(typeRepository.findById(99)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> typeService.getTypeById(99));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Type not found: 99"));
    }

    @Test
    void createType_setsIdToZeroAndSaves() {
        Type request = new Type(123, "MUTUAL FUND");
        when(typeRepository.save(any(Type.class))).thenReturn(new Type(10, "MUTUAL FUND"));

        Type result = typeService.createType(request);

        assertEquals(10, result.typeId());
        assertEquals("MUTUAL FUND", result.name());
        verify(typeRepository).save(new Type(0, "MUTUAL FUND"));
    }

    @Test
    void updateType_updatesWhenTypeExists() {
        Type request = new Type(0, "ETF");
        when(typeRepository.existsById(5)).thenReturn(true);
        when(typeRepository.save(any(Type.class))).thenReturn(new Type(5, "ETF"));

        Type result = typeService.updateType(5, request);

        assertEquals(5, result.typeId());
        assertEquals("ETF", result.name());
        verify(typeRepository).existsById(5);
        verify(typeRepository).save(new Type(5, "ETF"));
    }

    @Test
    void updateType_throwsNotFoundWhenTypeMissing() {
        when(typeRepository.existsById(5)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> typeService.updateType(5, new Type(0, "ETF")));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Type not found: 5"));
        verify(typeRepository).existsById(5);
        verify(typeRepository, never()).save(any(Type.class));
    }

    @Test
    void deleteType_deletesWhenTypeExists() {
        when(typeRepository.existsById(3)).thenReturn(true);

        typeService.deleteType(3);

        verify(typeRepository).existsById(3);
        verify(typeRepository).deleteById(3);
    }

    @Test
    void deleteType_throwsNotFoundWhenTypeMissing() {
        when(typeRepository.existsById(3)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> typeService.deleteType(3));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Type not found: 3"));
        verify(typeRepository).existsById(3);
        verify(typeRepository, never()).deleteById(anyInt());
    }
}