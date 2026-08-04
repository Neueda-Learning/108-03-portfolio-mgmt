package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("users")
public record Users(
        @Id int userId,
        String firstName,
        String lastName,
        String email
) {
//    Empty body
}
