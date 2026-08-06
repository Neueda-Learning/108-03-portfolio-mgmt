package com.neueda.controller;

import com.neueda.dto.AiInsightResponse;
import com.neueda.service.AiInsightsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-insights")
public class AiInsightsController {
    private final AiInsightsService aiInsightsService;

    public AiInsightsController(AiInsightsService aiInsightsService) {
        this.aiInsightsService = aiInsightsService;
    }

    @GetMapping("/{accountId}")
    public AiInsightResponse getAiInsights(@PathVariable int accountId) {
         return aiInsightsService.getAiInsights(accountId);
    }
}
