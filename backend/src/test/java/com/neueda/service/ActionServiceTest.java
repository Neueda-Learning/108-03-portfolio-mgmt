package com.neueda.service;

import com.neueda.model.Action;
import com.neueda.repository.ActionRepository;
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
class ActionServiceTest {

    @Mock
    private ActionRepository actionRepository;

    @InjectMocks
    private ActionService actionService;

    @Test
    void getAllActions_returnsAllActionsFromRepository() {
        List<Action> actions = List.of(new Action(1, "BUY"), new Action(2, "SELL"));
        when(actionRepository.findAll()).thenReturn(actions);

        List<Action> result = actionService.getAllActions();

        assertEquals(2, result.size());
        assertEquals("BUY", result.get(0).name());
        verify(actionRepository).findAll();
    }

    @Test
    void getActionById_returnsActionWhenFound() {
        when(actionRepository.findById(1)).thenReturn(Optional.of(new Action(1, "BUY")));

        Action result = actionService.getActionById(1);

        assertEquals(1, result.actionId());
        assertEquals("BUY", result.name());
        verify(actionRepository).findById(1);
    }

    @Test
    void getActionById_throwsNotFoundWhenActionMissing() {
        when(actionRepository.findById(99)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> actionService.getActionById(99));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Action not found: 99"));
    }

    @Test
    void createAction_setsIdToZeroAndSaves() {
        Action request = new Action(123, "BUY");
        when(actionRepository.save(any(Action.class))).thenReturn(new Action(10, "BUY"));

        Action result = actionService.createAction(request);

        assertEquals(10, result.actionId());
        assertEquals("BUY", result.name());
        verify(actionRepository).save(new Action(0, "BUY"));
    }

    @Test
    void updateAction_updatesWhenActionExists() {
        Action request = new Action(0, "SELL");
        when(actionRepository.existsById(5)).thenReturn(true);
        when(actionRepository.save(any(Action.class))).thenReturn(new Action(5, "SELL"));

        Action result = actionService.updateAction(5, request);

        assertEquals(5, result.actionId());
        assertEquals("SELL", result.name());
        verify(actionRepository).existsById(5);
        verify(actionRepository).save(new Action(5, "SELL"));
    }

    @Test
    void updateAction_throwsNotFoundWhenActionMissing() {
        when(actionRepository.existsById(5)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> actionService.updateAction(5, new Action(0, "BUY")));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Action not found: 5"));
        verify(actionRepository).existsById(5);
        verify(actionRepository, never()).save(any(Action.class));
    }

    @Test
    void deleteAction_deletesWhenActionExists() {
        when(actionRepository.existsById(3)).thenReturn(true);

        actionService.deleteAction(3);

        verify(actionRepository).existsById(3);
        verify(actionRepository).deleteById(3);
    }

    @Test
    void deleteAction_throwsNotFoundWhenActionMissing() {
        when(actionRepository.existsById(3)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> actionService.deleteAction(3));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Action not found: 3"));
        verify(actionRepository).existsById(3);
        verify(actionRepository, never()).deleteById(anyInt());
    }
}