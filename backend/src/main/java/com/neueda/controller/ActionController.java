package com.neueda.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neueda.model.Action;
import com.neueda.service.ActionService;

@RestController
@RequestMapping("/api/actions")
public class ActionController {

	private final ActionService actionService;

	public ActionController(ActionService actionService) {
		this.actionService = actionService;
	}

	@GetMapping
	public List<Action> getAllActions() {
		return actionService.getAllActions();
	}

	@GetMapping("/{id}")
	public Action getActionById(@PathVariable int id) {
		return actionService.getActionById(id);
	}

	@PostMapping
	public ResponseEntity<Action> createAction(@RequestBody Action request) {
		Action created = actionService.createAction(request);
		return ResponseEntity
				.created(URI.create("/api/actions/" + created.actionId()))
				.body(created);
	}

	@PutMapping("/{id}")
	public Action updateAction(@PathVariable int id, @RequestBody Action request) {
		return actionService.updateAction(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAction(@PathVariable int id) {
		actionService.deleteAction(id);
		return ResponseEntity.noContent().build();
	}
}

