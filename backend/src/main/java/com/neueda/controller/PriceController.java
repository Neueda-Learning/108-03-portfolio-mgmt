package com.neueda.controller;

import com.neueda.dto.PriceResponse;
import com.neueda.service.PriceService;
import com.neueda.service.PriceServiceV2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/price")
public class PriceController {
    private final PriceService priceService;
    private final PriceServiceV2 printServiceV2;

    public PriceController(PriceService priceService,
                           PriceServiceV2 priceServiceV2) {
        this.priceService = priceService;
        this.printServiceV2 = priceServiceV2;
    }

    @GetMapping("/{ticker}")
    public PriceResponse getPrice(@PathVariable String ticker) {
        return priceService.getPrice(ticker);
    }

    @GetMapping("/v2/{ticker}")
    public PriceResponse getPriceV2(@PathVariable String ticker) {
        return printServiceV2.getPrice(ticker);
    }
}
