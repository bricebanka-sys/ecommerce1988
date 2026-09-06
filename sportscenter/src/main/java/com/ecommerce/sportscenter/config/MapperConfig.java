package com.ecommerce.sportscenter.config;


import com.ecommerce.sportscenter.mapper.OrderMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Classe de configuration centralisée pour l'exposition des Mappers MapStruct
 * sous forme de Spring Beans dans le contexte d'application.
 */
@Configuration
public class MapperConfig {

    @Bean
    public OrderMapper orderMapper() {
        return Mappers.getMapper(OrderMapper.class);
    }
}
