package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("assets")
public record Assets(
        @Id int assetId,
        String name,
        int typeId
) {
}
