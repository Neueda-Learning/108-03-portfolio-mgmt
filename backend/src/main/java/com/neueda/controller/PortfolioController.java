package com.neueda.controller;

import com.neueda.dto.PortfolioResponse;
import com.neueda.service.PortfolioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/{accountId}")
    public PortfolioResponse getPortfolio(@PathVariable String accountId) {
        return portfolioService.getPortfolio(accountId);
    }
}
