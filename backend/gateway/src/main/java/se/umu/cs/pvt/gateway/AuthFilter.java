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
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * @author UNKNOWN (Doc: Griffin c20wnn)
 * @author Team Mango (Group 4) - 2024-05-22
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

    PermissionValidator permisisonValidater = new PermissionValidator();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        List<String> apiKeyHeader = exchange.getRequest().getHeaders().get("token");

        Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
        String routeId = route != null ? route.getId() : null;

        String path = route != null ? exchange.getRequest().getPath().toString() : null;

        ServerHttpRequest request = route != null ? exchange.getRequest() : null;

        String apiKey = "";
        if (apiKeyHeader != null) {
            apiKey = apiKeyHeader.get(0);
        }

        if (!isAuthorized(routeId, apiKey, path, request)) {
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
     * @param request 
     * @return true if is authorized, false otherwise
     */
    private boolean isAuthorized(
        String routeId, String apikey, String path, ServerHttpRequest request) {

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

        //System.err.println("permissions: " + permissions);
        //Logger.log(Level.DEBUG, "permissions: " + permissions);
        
        if (role.equals("ADMIN") || 
            permissions.contains(permisisonValidater.getAdminRightsValue()) ||
            request.getMethod().equals(HttpMethod.GET)) {
            return true;
        }
                
        // Check for each permission-locked api path and determine if user is allowed through
        if (path.startsWith("/api/session") 
            && !permisisonValidater.checkSessionPermissions(path, permissions)) return false;

        if (path.startsWith("/api/plan")
            && !permisisonValidater.checkPlanPermissions(path, permissions)) return false;

        if ((path.startsWith("/api/techniques") || path.startsWith("/api/exercises"))
            && !permisisonValidater.checkTechniqueExercisePermissions(path, permissions)) return false;

        if (path.startsWith("/api/examination")
            && !permisisonValidater.checkGradingPermissions(path, permissions)) return false;

        if (path.startsWith("/api/workouts") 
            && !permisisonValidater.checkWorkoutPermissions(path, permissions)) return false;

        return !isAdminLockedEndPoints(path);

    }

    private boolean isAdminLockedEndPoints(String path) {
        return 
            path.contains("import") || 
            path.contains("export") || 
            path.equals("/api/users") || 
            path.startsWith("/api/permissions/role");
    }
}
