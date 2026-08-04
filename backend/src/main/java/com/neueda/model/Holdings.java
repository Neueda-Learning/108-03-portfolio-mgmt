package com.neueda.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Holdings(
        int holdingId ,
        int userId ,
        int assetId ,
        float quantity ,
        int actionId ,
        BigDecimal pricePerUnit ,
        LocalDate transactionDate
) {
}
