package com.ecommerce.sportscenter.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 1. DSN du statut de réponse HTTP à 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // 2. Récupérer l'instance de PrintWriter à partir de la réponse HTTP
        PrintWriter writer = response.getWriter();
        // 3. Écrire le message personnalisé d'accès refusé accompagné du message d'exception
        writer.println("Access Denied: " + authException.getMessage());
    }
}
