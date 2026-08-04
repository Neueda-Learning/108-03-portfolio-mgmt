package com.neueda.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Point(
        LocalDate date,
        BigDecimal close
) {
}
