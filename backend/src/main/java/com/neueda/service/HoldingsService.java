package com.neueda.service;

import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.neueda.model.Holdings;
import com.neueda.repository.ActionRepository;
import com.neueda.repository.HoldingRepository;

@Service
public class HoldingsService {

	private final HoldingRepository holdingsRepository;
	private final ActionRepository actionRepository;

	public HoldingsService(HoldingRepository holdingsRepository, ActionRepository actionRepository) {
		this.holdingsRepository = holdingsRepository;
		this.actionRepository = actionRepository;
	}

	public List<Holdings> getAllHoldings() {
		return StreamSupport.stream(holdingsRepository.findAll().spliterator(), false)
				.toList();
	}

	public List<Holdings> getHoldingsByUserId(int userId) {
		return holdingsRepository.findByUserId(userId);
	}

	public Holdings getHoldingById(int id) {
		return holdingsRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Holding not found: " + id));
	}

	public Holdings createHolding(Holdings request) {
		// Check if this action is a SELL
		actionRepository.findById(request.actionId()).ifPresent(action -> {
			if ("SELL".equalsIgnoreCase(action.name())) {
				if (request.quantity() <= 0) {
					throw new ResponseStatusException(
							HttpStatus.BAD_REQUEST,
							"Cannot sell " + request.quantity() + " units. Quantity must be greater than zero.");
				}

				// Calculate net owned quantity for this user + asset
				List<Holdings> existing = holdingsRepository.findByUserIdAndAssetId(request.userId(), request.assetId());

				// Resolve BUY and SELL action IDs
				java.util.Map<String, Integer> actionIdByName = StreamSupport
						.stream(actionRepository.findAll().spliterator(), false)
						.collect(java.util.stream.Collectors.toMap(
								a -> a.name().toUpperCase(),
								a -> a.actionId()));

				int buyId  = actionIdByName.getOrDefault("BUY", -1);
				int sellId = actionIdByName.getOrDefault("SELL", -1);

				double netQuantity = existing.stream()
						.mapToDouble(h -> {
							if (h.actionId() == buyId)  return h.quantity();
							if (h.actionId() == sellId) return -h.quantity();
							return 0;
						})
						.sum();

				if (request.quantity() > netQuantity) {
					throw new ResponseStatusException(
							HttpStatus.BAD_REQUEST,
							"Cannot sell " + request.quantity() + " units of asset " + request.assetId()
									+ ". Current available quantity: " + netQuantity);
				}
			}
		});

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
