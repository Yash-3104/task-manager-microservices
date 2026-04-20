package com.example.taskservice.config;

import org.springframework.context.annotation.*;
import org.springframework.data.redis.cache.*;
import org.springframework.data.redis.connection.*;
import org.springframework.data.redis.serializer.*;
import org.springframework.cache.CacheManager;

import java.time.Duration;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {

        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new GenericJackson2JsonRedisSerializer()
                        )
                );

        return RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
    }
}