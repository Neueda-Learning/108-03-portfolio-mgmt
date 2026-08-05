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

import com.neueda.model.Holdings;
import com.neueda.service.HoldingsService;

@RestController
@RequestMapping("/api/holdings")
public class HoldingsController {

    private final HoldingsService holdingsService;

    public HoldingsController(HoldingsService holdingsService) {
        this.holdingsService = holdingsService;
    }

    @GetMapping
    public List<Holdings> getAllHoldings() {
        return holdingsService.getAllHoldings();
    }

    @GetMapping("/{id}")
    public Holdings getHoldingById(@PathVariable int id) {
        return holdingsService.getHoldingById(id);
    }

    @PostMapping
    public ResponseEntity<Holdings> createHolding(@RequestBody Holdings request) {
        Holdings created = holdingsService.createHolding(request);
        return ResponseEntity
                .created(URI.create("/api/holdings/" + created.holdingId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public Holdings updateHolding(@PathVariable int id, @RequestBody Holdings request) {
        return holdingsService.updateHolding(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHolding(@PathVariable int id) {
        holdingsService.deleteHolding(id);
        return ResponseEntity.noContent().build();
    }
}

