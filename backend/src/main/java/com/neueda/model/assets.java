package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("assets")
public record assets(
        @Id int asset_id,
        String name,
        int type_id
) {
}
