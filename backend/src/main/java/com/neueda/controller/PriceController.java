package com.neueda.controller;

import com.neueda.dto.PriceResponse;
import com.neueda.service.PriceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/price")
public class PriceController {
    private final PriceService priceService;

    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    @GetMapping("/{ticker}")
    public PriceResponse getPrice(@PathVariable String ticker) {
        return priceService.getPrice(ticker);
    }
}
