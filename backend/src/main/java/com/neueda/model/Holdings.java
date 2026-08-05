package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Table("holdings")
public record Holdings(
        @Id int holdingId ,
        int userId ,
        int assetId ,
        float quantity ,
        int actionId ,
        BigDecimal pricePerUnit ,
        LocalDate transactionDate
) {
}
