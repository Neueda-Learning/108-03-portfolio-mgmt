package com.neueda.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AiInsightResponse(
        String summary,
        List<AiRecommendation> recommendations,
        boolean aiGenerated,
        String disclaimer
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AiRecommendation(
            String title,
            String detail,
            String action,
            int priority
    ){}
}
