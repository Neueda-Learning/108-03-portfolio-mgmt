package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("types")
public record Type(
        @Id int typeId,
        String name
) {
}
