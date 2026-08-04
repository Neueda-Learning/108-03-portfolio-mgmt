package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Table("holdings")
public record holdings(
        @Id int holding_id ,
        int user_id ,
        int asset_id ,
        float quantity ,
        int action_id ,
        float price_bought ,
        LocalDate dateBought
) {
}
