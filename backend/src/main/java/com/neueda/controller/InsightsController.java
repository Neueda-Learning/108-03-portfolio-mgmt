package com.neueda.controller;

import com.neueda.dto.InsightsResponse;
import com.neueda.service.InsightService;
import com.neueda.service.PortfolioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {
    private final InsightService ps;
    public InsightsController(InsightService ps) {
        this.ps = ps;
    }

    @GetMapping("/{accountId}")
    public InsightsResponse getInsights(@PathVariable String accountId) {
        return ps.getInsights(Integer.parseInt(accountId));
    }
}
