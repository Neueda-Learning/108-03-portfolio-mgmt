package com.neueda.service;

import com.neueda.dto.ClusterInfo;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class ClusterCatalog {
    private static final Logger log = LoggerFactory.getLogger(ClusterCatalog.class);
    private Map<String, ClusterInfo> cluster = Map.of();

    @PostConstruct
    void load() throws IOException {
        try (var in = new ClassPathResource("clusters.json").getInputStream()) {
            var mapper = new ObjectMapper();
            cluster = mapper.readValue(in, new TypeReference<>() {
            });
            log.info("Loaded {} cluster mappings", cluster.size());
        }
    }

    public Optional<ClusterInfo> get(String ticker) {
        if (ticker == null || ticker.isBlank()) {
            return Optional.empty();
        }

        return Optional.ofNullable(cluster.get(ticker.trim().toUpperCase()));
    }
}
