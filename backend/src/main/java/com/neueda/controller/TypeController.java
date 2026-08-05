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

import com.neueda.model.Type;
import com.neueda.service.TypeService;

@RestController
@RequestMapping("/api/types")
public class TypeController {

	private final TypeService typeService;

	public TypeController(TypeService typeService) {
		this.typeService = typeService;
	}

	@GetMapping
	public List<Type> getAllTypes() {
		return typeService.getAllTypes();
	}

	@GetMapping("/{id}")
	public Type getTypeById(@PathVariable int id) {
		return typeService.getTypeById(id);
	}

	@PostMapping
	public ResponseEntity<Type> createType(@RequestBody Type request) {
		Type created = typeService.createType(request);
		return ResponseEntity
				.created(URI.create("/api/types/" + created.typeId()))
				.body(created);
	}

	@PutMapping("/{id}")
	public Type updateType(@PathVariable int id, @RequestBody Type request) {
		return typeService.updateType(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteType(@PathVariable int id) {
		typeService.deleteType(id);
		return ResponseEntity.noContent().build();
	}
}

