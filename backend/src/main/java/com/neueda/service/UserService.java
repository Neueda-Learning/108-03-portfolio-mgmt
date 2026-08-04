package com.neueda.service;

import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.neueda.model.User;
import com.neueda.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public List<User> getAllUsers() {
		return StreamSupport.stream(userRepository.findAll().spliterator(), false)
				.toList();
	}

	public User getUserById(int id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id));
	}

	public User createUser(User request) {
		User toCreate = new User(0, request.firstname(), request.lastname(), request.email());
		return userRepository.save(toCreate);
	}

	public User updateUser(int id, User request) {
		if (!userRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id);
		}

		User toUpdate = new User(id, request.firstname(), request.lastname(), request.email());
		return userRepository.save(toUpdate);
	}

	public void deleteUser(int id) {
		if (!userRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id);
		}
		userRepository.deleteById(id);
	}
}

