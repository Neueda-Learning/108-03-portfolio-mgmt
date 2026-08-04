package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("types")
public record type(
        @Id int type_id,
        String name
) {
//    Blanck body
}
