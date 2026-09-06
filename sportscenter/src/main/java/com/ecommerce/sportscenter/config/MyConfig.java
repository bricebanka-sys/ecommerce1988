package com.ecommerce.sportscenter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class MyConfig {

    /**
     * Configuration du service de détails utilisateurs en mémoire.
     */
   /** @Bean
    public UserDetailsService userDetailsService(){

        // Construction de l'utilisateur avec identifiants et rôle
        UserDetails userDetails = User.builder()
                .username("Mesmin")
                .password(passwordEncoder().encode("password123")) // Chiffrement du mot de passe brut
                .roles("admin") // Attribution du rôle "admin"
                .build();

        // Retourne le gestionnaire en mémoire contenant l'utilisateur configuré
        return new InMemoryUserDetailsManager(userDetails);
    }

    /**
     * Bean de chiffrement des mots de passe utilisant l'algorithme BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
