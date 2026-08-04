package com.neueda.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("users")
public record users(
        @Id int user_id,
        String firstname,
        String lastname,
        String email
) {
//    Empty body
}
