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

import com.neueda.model.Assets;
import com.neueda.service.AssetService;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

	private final AssetService assetService;

	public AssetController(AssetService assetService) {
		this.assetService = assetService;
	}

	@GetMapping
	public List<Assets> getAllAssets() {
		return assetService.getAllAssets();
	}

	@GetMapping("/{id}")
	public Assets getAssetById(@PathVariable int id) {
		return assetService.getAssetById(id);
	}

	@PostMapping
	public ResponseEntity<Assets> createAsset(@RequestBody Assets request) {
		Assets created = assetService.createAsset(request);
		return ResponseEntity
				.created(URI.create("/api/assets/" + created.assetId()))
				.body(created);
	}

	@PutMapping("/{id}")
	public Assets updateAsset(@PathVariable int id, @RequestBody Assets request) {
		return assetService.updateAsset(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAsset(@PathVariable int id) {
		assetService.deleteAsset(id);
		return ResponseEntity.noContent().build();
	}
}

