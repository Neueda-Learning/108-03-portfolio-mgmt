package com.neueda.service;

import com.neueda.model.User;
import com.neueda.repository.UserRepository;
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
class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserService userService;

	@Test
	void getAllUsers_returnsAllUsersFromRepository() {
		List<User> users = List.of(
				new User(1, "Alice", "Smith", "alice@example.com"),
				new User(2, "Bob", "Jones", "bob@example.com")
		);
		when(userRepository.findAll()).thenReturn(users);

		List<User> result = userService.getAllUsers();

		assertEquals(2, result.size());
		assertEquals("Alice", result.get(0).firstname());
		verify(userRepository).findAll();
	}

	@Test
	void getAllUsers_returnsEmptyListWhenRepositoryEmpty() {
		when(userRepository.findAll()).thenReturn(List.of());

		List<User> result = userService.getAllUsers();

		assertTrue(result.isEmpty());
		verify(userRepository).findAll();
	}

	@Test
	void getUserById_returnsUserWhenFound() {
		User user = new User(5, "Pranav", "Menon", "pranav@example.com");
		when(userRepository.findById(5)).thenReturn(Optional.of(user));

		User result = userService.getUserById(5);

		assertEquals(5, result.userId());
		assertEquals("Pranav", result.firstname());
		verify(userRepository).findById(5);
	}

	@Test
	void getUserById_throwsNotFoundWhenMissing() {
		when(userRepository.findById(404)).thenReturn(Optional.empty());

		ResponseStatusException ex = assertThrows(ResponseStatusException.class,
				() -> userService.getUserById(404));

		assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
		assertTrue(ex.getReason().contains("User not found: 404"));
	}

	@Test
	void createUser_setsIdToZeroBeforeSave() {
		User request = new User(999, "Anushka", "K", "anushka@example.com");
		when(userRepository.save(any(User.class))).thenReturn(new User(7, "Anushka", "K", "anushka@example.com"));

		User result = userService.createUser(request);

		assertEquals(7, result.userId());
		verify(userRepository).save(new User(0, "Anushka", "K", "anushka@example.com"));
	}

	@Test
	void createUser_propagatesRepositoryException() {
		User request = new User(0, "S", "R", "sruthi@example.com");
		when(userRepository.save(any(User.class))).thenThrow(new RuntimeException("db write failed"));

		RuntimeException ex = assertThrows(RuntimeException.class,
				() -> userService.createUser(request));

		assertTrue(ex.getMessage().contains("db write failed"));
	}

	@Test
	void updateUser_updatesWhenUserExists() {
		User request = new User(0, "Shashank", "R", "shashank@example.com");
		when(userRepository.existsById(10)).thenReturn(true);
		when(userRepository.save(any(User.class))).thenReturn(new User(10, "Shashank", "R", "shashank@example.com"));

		User result = userService.updateUser(10, request);

		assertEquals(10, result.userId());
		assertEquals("Shashank", result.firstname());
		verify(userRepository).save(new User(10, "Shashank", "R", "shashank@example.com"));
	}

	@Test
	void updateUser_throwsNotFoundWhenUserMissing() {
		when(userRepository.existsById(10)).thenReturn(false);

		ResponseStatusException ex = assertThrows(ResponseStatusException.class,
				() -> userService.updateUser(10, new User(0, "X", "Y", "x@example.com")));

		assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
		assertTrue(ex.getReason().contains("User not found: 10"));
		verify(userRepository, never()).save(any(User.class));
	}

	@Test
	void deleteUser_deletesWhenUserExists() {
		when(userRepository.existsById(2)).thenReturn(true);

		userService.deleteUser(2);

		verify(userRepository).deleteById(2);
	}

	@Test
	void deleteUser_throwsNotFoundWhenUserMissing() {
		when(userRepository.existsById(2)).thenReturn(false);

		ResponseStatusException ex = assertThrows(ResponseStatusException.class,
				() -> userService.deleteUser(2));

		assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
		assertTrue(ex.getReason().contains("User not found: 2"));
		verify(userRepository, never()).deleteById(anyInt());
	}

}