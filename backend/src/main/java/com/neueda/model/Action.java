package com.neueda.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("actions")
public record Action(
        @Id int actionId,
        String name
) {
}
