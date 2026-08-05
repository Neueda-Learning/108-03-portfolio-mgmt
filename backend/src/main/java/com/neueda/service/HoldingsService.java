package com.neueda.service;

import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.neueda.model.Holdings;
import com.neueda.repository.HoldingRepository;

@Service
public class HoldingsService {

	private final HoldingRepository holdingsRepository;

	public HoldingsService(HoldingRepository holdingsRepository) {
		this.holdingsRepository = holdingsRepository;
	}

	public List<Holdings> getAllHoldings() {
		return StreamSupport.stream(holdingsRepository.findAll().spliterator(), false)
				.toList();
	}

	public Holdings getHoldingById(int id) {
		return holdingsRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Holding not found: " + id));
	}

	public Holdings createHolding(Holdings request) {
		Holdings toCreate = new Holdings(
				0,
				request.userId(),
				request.assetId(),
				request.quantity(),
				request.actionId(),
				request.pricePerUnit(),
				request.transactionDate());

		return holdingsRepository.save(toCreate);
	}

	public Holdings updateHolding(int id, Holdings request) {
		if (!holdingsRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Holding not found: " + id);
		}

		Holdings toUpdate = new Holdings(
				id,
				request.userId(),
				request.assetId(),
				request.quantity(),
				request.actionId(),
				request.pricePerUnit(),
				request.transactionDate());

		return holdingsRepository.save(toUpdate);
	}

	public void deleteHolding(int id) {
		if (!holdingsRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Holding not found: " + id);
		}
		holdingsRepository.deleteById(id);
	}
}
