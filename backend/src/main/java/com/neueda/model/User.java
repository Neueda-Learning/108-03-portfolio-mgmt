package com.neueda.model;

public record User(
        int userId,
        String firstName,
        String lastName,
        String email
) {
}
