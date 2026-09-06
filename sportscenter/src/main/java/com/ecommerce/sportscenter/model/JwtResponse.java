package com.ecommerce.sportscenter.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


// -----------------------Mesmin-Dev---------------------------------
/**
 * DTO représentant la réponse renvoyée au client contenant le jeton JWT généré.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {

    private String username;
    private String token;
}
