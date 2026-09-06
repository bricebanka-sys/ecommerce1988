package com.ecommerce.sportscenter.config;


import com.ecommerce.sportscenter.security.JwtAuthenticationEntryPoint;
import com.ecommerce.sportscenter.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Classe de configuration principale de Spring Security.
 */

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint entryPoint;
    private final JwtAuthenticationFilter filter;

    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;

    // Injection par constructeur des composants de sécurité
    public SecurityConfig(JwtAuthenticationEntryPoint entryPoint, JwtAuthenticationFilter filter) {
        this.entryPoint = entryPoint;
        this.filter = filter;
    }

    /**
     * Déclaration de la chaîne de filtres de sécurité (SecurityFilterChain).
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 1. Désactivation de CSRF (inutile pour les API REST utilisant des tokens JWT)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                // 2. Configuration des autorisations sur les URLs (Request Matchers)
                .authorizeHttpRequests(request -> request
                        // Autoriser publiquement Swagger UI et OpenAPI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        // 2. Autoriser l'authentification et l'enregistrement
                        .requestMatchers("/api/account/login", "/api/account/register").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll() // Endpoints publics
                        .requestMatchers("/api/products/**").permitAll()             // Endpoints protégés
                        .requestMatchers("/api/baskets/**").authenticated()
                        .anyRequest().authenticated()                                  // Toutes les autres requêtes nécessitent une authentification
                )

                // 3. Gestion des exceptions de sécurité (401 Unauthorized)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(this.entryPoint)
                )

                // 4. Politique de session : STATELESS (sans session HTTP côté serveur)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 5. Positionnement du filtre JWT AVANT le filtre d'authentification par défaut
                .addFilterBefore(this.filter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Expose le Bean AuthenticationManager pour qu'il puisse être injecté
     * dans les services ou contrôleurs (ex: AuthController pour le login).
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
