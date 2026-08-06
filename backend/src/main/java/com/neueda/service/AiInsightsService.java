package com.neueda.service;

import com.neueda.dto.AiInsightResponse;
import com.neueda.dto.InsightsResponse;
import com.neueda.dto.PortfolioResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class AiInsightsService {
    private static final Logger log = LoggerFactory.getLogger(AiInsightsService.class);
    private static final String DISCLAIMER = "AI-generated insights are informational only and are not financial advice.";
    private static final String PROMPT = """
            You are a financial advisor. You will be given a portfolio and insights data.
            Below is a portfolio with pre-computed metrics and findings from a deterministic rule engine.
            Rules - follow strictly:
            - Use only numbers presented in the JSON. Never calculate or estimate any metrics. If a metric is not present, do not mention it.
            - Do not forecast prices or predict future returns.
            - Cluster labels represent past volatility behaviour, not future outcomes.
            - Use plain English.
            - Return valid JSON only. Do not wrap the response in markdown fences.

            Give 2-3 actionable recommendations based on the portfolio and insights data. The response must exactly match this JSON shape:
            {
              "summary": "2-3 brief sentences describing the portfolio and insights data",
              "recommendations": [
                {
                  "title": "short",
                  "detail": "1-2 sentences of actionable recommendation",
                  "action": "BUY|SELL|HOLD|REVIEW",
                  "priority": 1
                }
              ]
            }
            """;
    private final PortfolioService portfolioService;
    private final InsightService insightService;
    private final RestClient ollamaClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String ollamaModel;

    public AiInsightsService(PortfolioService portfolioService,
                             InsightService insightService,
                             @Value("${ollama.base.url:http://localhost:11434}") String ollamaBaseUrl,
                             @Value("${ollama.model:qwen2.5:7b-instruct}") String ollamaModel) {
        this.portfolioService = portfolioService;
        this.insightService = insightService;
        this.ollamaClient = RestClient.builder().baseUrl(ollamaBaseUrl).build();
        this.ollamaModel = ollamaModel;
    }

    private String buildPayload(int accountId) {
        PortfolioResponse res = portfolioService.getPortfolio(accountId);
        InsightsResponse ins = insightService.getInsights(accountId);

        return "Portfolio:\n" + res + "\n\nInsights:\n" + ins;
    }

    public AiInsightResponse getAiInsights(int accountId) {
        String payload = buildPayload(accountId);
        return getOllamaInsights(accountId, payload);
    }

    private AiInsightResponse getOllamaInsights(int accountId, String payload) {
        try {
            OllamaChatResponse response = ollamaClient.post()
                    .uri("/api/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new OllamaChatRequest(
                            ollamaModel,
                            List.of(new OllamaChatRequest.Message("user", PROMPT + "\n\nInput JSON:\n" + payload)),
                            false,
                            "json"
                    ))
                    .retrieve()
                    .body(OllamaChatResponse.class);

            String rawJson = response == null || response.message() == null ? null : response.message().content();
            ParsedAiInsight parsed = objectMapper.readValue(stripCodeFences(rawJson), ParsedAiInsight.class);

            return new AiInsightResponse(
                    parsed.summary() == null ? "AI insights generated successfully." : parsed.summary(),
                    parsed.recommendations() == null ? List.of() : parsed.recommendations(),
                    true,
                    DISCLAIMER
            );
        } catch (Exception e) {
            log.error("Failed to generate local Ollama AI insights for account {}", accountId, e);
            return fallbackResponse("AI insights are temporarily unavailable.");
        }
    }


    private String stripCodeFences(String rawJson) {
        String trimmed = rawJson == null ? "" : rawJson.trim();
        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
            String withoutOpen = trimmed.replaceFirst("^```(?:json)?", "").trim();
            return withoutOpen.substring(0, withoutOpen.length() - 3).trim();
        }
        return trimmed;
    }

    private AiInsightResponse fallbackResponse(String summary) {
        return new AiInsightResponse(summary, List.of(), false, DISCLAIMER);
    }

    private record ParsedAiInsight(
            String summary,
            List<AiInsightResponse.AiRecommendation> recommendations
    ) {
    }

    private record OllamaChatRequest(
            String model,
            List<Message> messages,
            boolean stream,
            String format
    ) {
        private record Message(String role, String content) {
        }
    }

    private record OllamaChatResponse(Message message) {
        private record Message(String role, String content) {
        }
    }
}
