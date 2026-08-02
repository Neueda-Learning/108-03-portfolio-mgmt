package com.neueda.model;

import java.time.LocalDate;

public record holdings(
        int holding_id ,
        int user_id ,
        int asset_id ,
        float quantity ,
        int action_id ,
        float price_bought ,
        LocalDate dateBought
) {
}
