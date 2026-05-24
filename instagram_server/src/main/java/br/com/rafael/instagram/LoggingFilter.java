package br.com.rafael.instagram;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class LoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request, 10000);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        long tempoInicio = System.currentTimeMillis();

        filterChain.doFilter(wrappedRequest, wrappedResponse);

        long tempoFim = System.currentTimeMillis();

        String jsonEntrada = new String(wrappedRequest.getContentAsByteArray(), StandardCharsets.UTF_8);
        String jsonSaida = new String(wrappedResponse.getContentAsByteArray(), StandardCharsets.UTF_8);

        System.out.println("\n=======================================================");
        System.out.println("[ENTRADA] " + request.getMethod() + " " + request.getRequestURI());
        if (!jsonEntrada.isBlank()) {
            System.out.println("Body (Entrada): \n" + jsonEntrada);
        }

        System.out.println("\n[SAÍDA] Status HTTP: " + response.getStatus() + " | Tempo: " + (tempoFim - tempoInicio) + "ms");
        if (!jsonSaida.isBlank()) {
            System.out.println("Body (Saída): \n" + jsonSaida);
        }
        System.out.println("=======================================================\n");

        wrappedResponse.copyBodyToResponse();
    }
}