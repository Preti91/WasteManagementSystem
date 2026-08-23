//package com.example.WasteManagementSystem.security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.SecretKey;
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//
//@Service
//public class JwtService {
//
//    private static final String SECRET_KEY =
//            "SmartWasteSecretKeyForJWTAuthentication2026";
//
//    private final SecretKey key = Keys.hmacShaKeyFor(
//            SECRET_KEY.getBytes(StandardCharsets.UTF_8)
//    );
//
//    public String generateToken(UserDetails userDetails) {
//
//        return Jwts.builder()
//                .subject(userDetails.getUsername())
//                .issuedAt(new Date())
//                .expiration(
//                        new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24)
//                )
//                .signWith(key)
//                .compact();
//    }
//
//    public String extractUsername(String token) {
//
//        return extractAllClaims(token).getSubject();
//    }
//
//    public boolean isTokenValid(
//            String token,
//            UserDetails userDetails) {
//
//        String username = extractUsername(token);
//
//        return username.equals(userDetails.getUsername())
//                && !isTokenExpired(token);
//    }
//
//    private boolean isTokenExpired(String token) {
//
//        return extractAllClaims(token)
//                .getExpiration()
//                .before(new Date());
//    }
//
//    private Claims extractAllClaims(String token) {
//
//        return Jwts.parser()
//                .verifyWith(key)
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }
//}


package com.example.WasteManagementSystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // IMPORTANT:
    // Keep this secret at least 32 characters long.
    private static final String SECRET_KEY =
            "WasteManagementSystemSecretKey2026Secure123456";

    // Token validity: 24 hours
    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    // =========================
    // GENERATE TOKEN
    // =========================

    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    // =========================
    // EXTRACT USERNAME / EMAIL
    // =========================

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // =========================
    // EXTRACT CLAIM
    // =========================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // =========================
    // EXTRACT ALL CLAIMS
    // =========================

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // =========================
    // CHECK TOKEN VALID
    // =========================

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        try {

            final String username =
                    extractUsername(token);

            return username.equals(
                    userDetails.getUsername()
            )
                    && !isTokenExpired(token);

        } catch (Exception e) {

            System.out.println(
                    "JWT validation failed: "
                            + e.getMessage()
            );

            return false;
        }
    }

    // =========================
    // CHECK EXPIRATION
    // =========================

    private boolean isTokenExpired(String token) {

        Date expiration =
                extractClaim(
                        token,
                        Claims::getExpiration
                );

        return expiration.before(new Date());
    }
}