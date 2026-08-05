package com.neueda.service;

import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.neueda.model.Type;
import com.neueda.repository.AssetTypeRepository;

@Service
public class TypeService {

	private final AssetTypeRepository typeRepository;

	public TypeService(AssetTypeRepository typeRepository) {
		this.typeRepository = typeRepository;
	}

	public List<Type> getAllTypes() {
		return StreamSupport.stream(typeRepository.findAll().spliterator(), false)
				.toList();
	}

	public Type getTypeById(int id) {
		return typeRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found: " + id));
	}

	public Type createType(Type request) {
		Type toCreate = new Type(0, request.name());
		return typeRepository.save(toCreate);
	}

	public Type updateType(int id, Type request) {
		if (!typeRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found: " + id);
		}

		Type toUpdate = new Type(id, request.name());
		return typeRepository.save(toUpdate);
	}

	public void deleteType(int id) {
		if (!typeRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found: " + id);
		}
		typeRepository.deleteById(id);
	}
}

