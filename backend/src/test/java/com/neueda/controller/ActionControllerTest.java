package com.neueda.controller;import com.neueda.model.Action;
import com.neueda.service.ActionService;
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
class ActionControllerTest {

    @Mock
    private ActionService actionService;

    @InjectMocks
    private ActionController actionController;

    @Test
    void getAllActions_returnsAllActionsFromService() {
        List<Action> expected = List.of(new Action(1, "BUY"), new Action(2, "SELL"));
        when(actionService.getAllActions()).thenReturn(expected);

        List<Action> actual = actionController.getAllActions();

        assertEquals(expected, actual);
        verify(actionService).getAllActions();
    }

    @Test
    void getActionById_returnsActionFromService() {
        Action expected = new Action(7, "BUY");
        when(actionService.getActionById(7)).thenReturn(expected);

        Action actual = actionController.getActionById(7);

        assertEquals(expected, actual);
        verify(actionService).getActionById(7);
    }

    @Test
    void getActionById_propagatesNotFoundFromService() {
        when(actionService.getActionById(99))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Action not found: 99"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> actionController.getActionById(99));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void createAction_returnsCreatedResponseWithLocationAndBody() {
        Action request = new Action(0, "BUY");
        Action created = new Action(10, "BUY");
        when(actionService.createAction(request)).thenReturn(created);

        ResponseEntity<Action> response = actionController.createAction(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(created, response.getBody());
        assertEquals(URI.create("/api/actions/10"), response.getHeaders().getLocation());
        verify(actionService).createAction(request);
    }

    @Test
    void updateAction_returnsUpdatedActionFromService() {
        Action request = new Action(0, "SELL");
        Action updated = new Action(5, "SELL");
        when(actionService.updateAction(5, request)).thenReturn(updated);

        Action actual = actionController.updateAction(5, request);

        assertEquals(updated, actual);
        verify(actionService).updateAction(5, request);
    }

    @Test
    void updateAction_propagatesNotFoundFromService() {
        Action request = new Action(0, "SELL");
        when(actionService.updateAction(77, request))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Action not found: 77"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> actionController.updateAction(77, request));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deleteAction_returnsNoContentWhenServiceDeletes() {
        doNothing().when(actionService).deleteAction(3);

        ResponseEntity<Void> response = actionController.deleteAction(3);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(actionService).deleteAction(3);
    }

    @Test
    void deleteAction_propagatesNotFoundFromService() {
        doThrow(new ResponseStatusException(NOT_FOUND, "Action not found: 44"))
                .when(actionService).deleteAction(44);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> actionController.deleteAction(44));

        assertEquals(NOT_FOUND, ex.getStatusCode());
    }
}