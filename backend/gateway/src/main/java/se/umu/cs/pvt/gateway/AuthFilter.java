package se.umu.cs.pvt.gateway;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;

import org.springframework.http.HttpMethod;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * @author UNKNOWN (Doc: Griffin c20wnn)
 * @author Team Mango (Group 4) - 2024-05-23
 * @since 2024-05-23
 *
 *         AuthFilter.java - Authorization class.
 *         GatewayApplication.java - SpringBootApplication
 *         GatewayApplicationTests.java - Tests.
 */

@Component
public class AuthFilter implements GlobalFilter, Ordered {

    /**
     * The SECRET salt for generating and validating Json Web Tokens.
     */
    private final String secret = "PVT";

    PermissionValidator PermissionValidator = new PermissionValidator();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        List<String> apiKeyHeader = exchange.getRequest().getHeaders().get("token");

        Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
        String routeId = route != null ? route.getId() : null;

        String path = route != null ? exchange.getRequest().getPath().toString() : null;

        HttpMethod method = route != null ? exchange.getRequest().getMethod() : null;

        String apiKey = "";
        if (apiKeyHeader != null) {
            apiKey = apiKeyHeader.get(0);
        }

        if (!isAuthorized(routeId, apiKey, path, method)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please check your api key.");
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }

    /**
     * @param routeId id of route
     * @param apikey  client header api key
     * @param method The API calls http method
     * @return true if is authorized, false otherwise
     */
    private boolean isAuthorized(
        String routeId, String apikey, String path, HttpMethod method) {

        // Always access to webserver and login api
        if (routeId.equals("webserver") || path.equals("/api/users/verify") || path.startsWith("/api/media/files/")) {
            return true;
        }

        // check that an api key is given, when accessing api
        if (apikey.isEmpty()) {
            return false;
        }

        // Select user role from apikey
        List<Integer> permissions;
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                    .withSubject("User Details")
                    .withIssuer("PVT/User")
                    .build();
            permissions = verifier.verify(apikey).getClaim("permissions").asList(Integer.class);
        } catch (Exception e) {
            return false;
        }
        
        if (adminOrGetMethod(method, permissions)) {
            return true;
        }
                
        if (!PermissionValidator.validate(path, permissions)) {
            return false;
        }

        return !isAdminLockedEndPoint(path);

    }

    private boolean adminOrGetMethod(HttpMethod method, List<Integer> permissions) {
        return
            permissions.contains(PermissionValidator.getAdminRightsValue()) ||
            method.equals(HttpMethod.GET);
    }

    private boolean isAdminLockedEndPoint(String path) {
        return 
            path.contains("import") || 
            path.contains("export") || 
            path.equals("/api/users") || 
            path.startsWith("/api/permissions/role");
    }
}
