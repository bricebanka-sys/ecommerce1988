package com.ecommerce.sportscenter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Applique le CORS à toutes les routes de l'API
                .allowedOriginPatterns("http://localhost:3000",
                        "https://ecommerce1988.vercel.app") // Autorise toutes les origines (ex: http://localhost:3000)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Méthodes HTTP autorisées
                .allowedHeaders("*") // Autorise tous les en-têtes
                .allowCredentials(true); // Permet l'envoi de cookies, headers d'authentification, etc.
    }
}


// ------------------------Mesmin-Dev---------------------------------