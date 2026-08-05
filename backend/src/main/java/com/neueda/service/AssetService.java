package com.neueda.service;

import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.neueda.model.Assets;
import com.neueda.repository.AssetRepository;

@Service
public class AssetService {

	private final AssetRepository assetRepository;

	public AssetService(AssetRepository assetRepository) {
		this.assetRepository = assetRepository;
	}

	public List<Assets> getAllAssets() {
		return StreamSupport.stream(assetRepository.findAll().spliterator(), false)
				.toList();
	}

	public Assets getAssetById(int id) {
		return assetRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found: " + id));
	}

	public Assets createAsset(Assets request) {
		Assets toCreate = new Assets(0, request.name(), request.typeId());
		return assetRepository.save(toCreate);
	}

	public Assets updateAsset(int id, Assets request) {
		if (!assetRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found: " + id);
		}

		Assets toUpdate = new Assets(id, request.name(), request.typeId());
		return assetRepository.save(toUpdate);
	}

	public void deleteAsset(int id) {
		if (!assetRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found: " + id);
		}
		assetRepository.deleteById(id);
	}
}

