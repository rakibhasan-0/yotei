package se.umu.cs.pvt.gateway;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author UNKNOWN (Doc: Griffin c20wnn)
 * @author Team Mango (Grupp 4) - 2024-05-20
 * @since 2024-05-20
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

    // Enum for all existing permissions
    // These are listed in permissions.sql and should mirror 
    // what is present in utils.js
    private enum permission_list {
        ADMIN_RIGHTS(0),
	    SESSION_OWN(1), //Edit your own sessions.
	    SESSION_ALL(2), //Edit all sessions.
	    PLAN_OWN(3),
	    PLAN_ALL(4),
	    WORKOUT_OWN(5),
	    WORKOUT_ALL(6),
	    ACTIVITY_OWN(7),
	    ACTIVITY_ALL(8),
	    GRADING_OWN(9),
	    GRADING_ALL(10);

        private final int value;
        private permission_list(int value) {
            this.value = value;
        }
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        List<String> apiKeyHeader = exchange.getRequest().getHeaders().get("token");

        Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
        String routeId = route != null ? route.getId() : null;

        String path = route != null ? exchange.getRequest().getPath().toString() : null;

        String apiKey = "";
        if (apiKeyHeader != null) {
            apiKey = apiKeyHeader.get(0);
        }

        if (!isAuthorized(routeId, apiKey, path)) {
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
     * @return true if is authorized, false otherwise
     */
    private boolean isAuthorized(String routeId, String apikey, String path) {

        // Always access to webserver and login api
        if (routeId.equals("webserver") || path.equals("/api/users/verify") || path.startsWith("/api/media/files/")) {
            return true;
        }

        // check that an api key is given, when accessing api
        if (apikey.isEmpty()) {
            return false;
        }

        // Select user role from apikey
        String role = "";
        List<Integer> permissions;
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                    .withSubject("User Details")
                    .withIssuer("PVT/User")
                    .build();
            role = verifier.verify(apikey).getClaim("role").asString();
            permissions = verifier.verify(apikey).getClaim("permissions").asList(Integer.class);
        } catch (Exception e) {
            return false;
        }

        if (role.equals("ADMIN") || permissions.contains(permission_list.ADMIN_RIGHTS.value)) {
            return true;
        }

        // Protect import and export endpoints
        // Only allow admin to create users
        if (!(path.contains("import") || path.contains("export") || path.equals("/api/users"))) return false;

        // Check for each permission-locked api path and determine if user is allowed through
        if (path.startsWith("/api/session")) {
            // Might be a better way but this makes it so that no 
            // newly created endpoint is permission-locked from the get-go
            // Any new endpoint that needs to be locked has to be included here
            String[] permission_locked_paths = {
                "/add",
                "/addList",
                "/delete",
                "/deleteByPlan",
                "/update",
            };

            String api_path = path.substring(path.indexOf("/api/session"));
            if (Arrays.asList(permission_locked_paths).contains(api_path)) {
                if (!(permissions.contains(permission_list.SESSION_OWN.value) || 
                    permissions.contains(permission_list.SESSION_ALL.value))) {
                    return false;
                }
            }
        }

        return true;
    }

}
