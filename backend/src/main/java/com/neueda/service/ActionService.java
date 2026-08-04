package com.neueda.service;

import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.neueda.model.Action;
import com.neueda.repository.ActionRepository;

@Service
public class ActionService {

	private final ActionRepository actionRepository;

	public ActionService(ActionRepository actionRepository) {
		this.actionRepository = actionRepository;
	}

	public List<Action> getAllActions() {
		return StreamSupport.stream(actionRepository.findAll().spliterator(), false)
				.toList();
	}

	public Action getActionById(int id) {
		return actionRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Action not found: " + id));
	}

	public Action createAction(Action request) {
		Action toCreate = new Action(0, request.name());
		return actionRepository.save(toCreate);
	}

	public Action updateAction(int id, Action request) {
		if (!actionRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Action not found: " + id);
		}

		Action toUpdate = new Action(id, request.name());
		return actionRepository.save(toUpdate);
	}

	public void deleteAction(int id) {
		if (!actionRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Action not found: " + id);
		}
		actionRepository.deleteById(id);
	}
}

