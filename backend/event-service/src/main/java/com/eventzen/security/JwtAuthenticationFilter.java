package com.eventzen.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // List of URL patterns that should be excluded from JWT authentication
    private final List<String> excludedUrls = Arrays.asList(
            "/auth/",
            "/events$",
            "/events/public/",
            "/events/[a-zA-Z0-9-]+$",
            "/events/[a-zA-Z0-9-]+/status",
            "/vendors/public/",
            "/api-docs/",
            "/swagger-ui/",
            "/health/",
            "/actuator/");

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Special handling for event list endpoint
        if (path.endsWith("/events")) {
            return true;
        }

        // Special handling for event ID endpoints
        if (path.matches(".*/events/[a-zA-Z0-9-]+$")) {
            return true;
        }

        // Special handling for event status update endpoints
        if (path.matches(".*/events/[a-zA-Z0-9-]+/status")) {
            return true;
        }

        return excludedUrls.stream().anyMatch(path::contains);
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // If no Authorization header or not a Bearer token, continue with the filter
        // chain
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } catch (Exception e) {
                    log.debug("Could not set user authentication: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}