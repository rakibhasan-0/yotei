package se.umu.cs.pvt.gateway;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.deser.DataFormatReaders.Match;

import ch.qos.logback.classic.Level;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
    private enum permissionList {
        ADMIN_RIGHTS(1),
	    SESSION_OWN(2), //Edit your own sessions.
	    SESSION_ALL(3), //Edit all sessions.
	    PLAN_OWN(4),
	    PLAN_ALL(5),
	    WORKOUT_OWN(6),
	    WORKOUT_ALL(7),
	    ACTIVITY_OWN(8),
	    ACTIVITY_ALL(9),
	    GRADING_OWN(10),
	    GRADING_ALL(11);

        private final int value;
        private permissionList(int value) {
            this.value = value;
        }
    }

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
            permissions.contains(permissionList.ADMIN_RIGHTS.value) ||
            request.getMethod().equals(HttpMethod.GET)) {
            return true;
        }
        
        //throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "permissions: " + permissions + "\nadmin right: " + permission_list.ADMIN_RIGHTS.value);
        
        // Check for each permission-locked api path and determine if user is allowed through
        if (path.startsWith("/api/session") 
            && !checkSessionPermissions(path, permissions)) return false;

        if (path.startsWith("/api/workouts") 
        && !checkWorkoutPermissions(path, permissions, request)) return false;

        return !isAdminLockedEndPoints(path);

    }

    private boolean checkSessionPermissions(String path, List<Integer> permissions) {
        // Might be a better way but this makes it so that no 
        // newly created endpoint is permission-locked from the get-go
        // Any new endpoint that needs to be locked has to be included here
        Pattern[] patterns = {
            // From SessionController
            Pattern.compile("^/api/session/add$"),
            Pattern.compile("^/api/session/addList$"),
            Pattern.compile("^/api/session/delete$"),
            Pattern.compile("^/api/session/deleteByPlan$"),
            Pattern.compile("^/api/session/update$"),
            // From SessionReviewController
            Pattern.compile("^/api/session/\\d+/review$"),
            Pattern.compile("^/api/session/\\d+/review/\\d+/activity$"),
            Pattern.compile("^/api/session/\\d+/review/\\d+/activity/\\d+$"),
            Pattern.compile("^/api/session/\\d+/review/\\d+$")
        };
    
        Integer[] permissionsToCheck = {
            permissionList.SESSION_ALL.value,
            permissionList.SESSION_OWN.value
        };

        return hasPermission(path, permissions, Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    private boolean checkWorkoutPermissions(
        String path, List<Integer> permissions, ServerHttpRequest request) {
        // Might be a better way but this makes it so that no 
        // newly created endpoint is permission-locked from the get-go
        // Any new endpoint that needs to be locked has to be included here
        Pattern[] patterns = {
            // From WorkoutController
            Pattern.compile("^/api/workouts$"),
            Pattern.compile("^/api/workouts/update_full_workout$"),
            Pattern.compile("^/api/workouts/reviews$"),
            Pattern.compile("^/api/workouts/favorites$"),
            Pattern.compile("^/api/workouts/add_full_workout$"),
            Pattern.compile("^/api/workouts/delete_full_workout/\\d+$"),
            Pattern.compile("^/api/workouts/delete/\\d+$"),
            // From UserWorkoutController
            Pattern.compile("^/api/workouts/add/workout/\\d+/user/\\d+$"),
            Pattern.compile("^/api/workouts/remove/workout/\\d+/user/\\d+$"),
        };
    
        Integer[] permissionsToCheck = {
            permissionList.WORKOUT_ALL.value,
            permissionList.WORKOUT_OWN.value
        };

        return hasPermission(
            path, permissions, Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }


    private boolean hasPermission(String path, List<Integer> permissions, List<Pattern> patterns, List<Integer> permissionsToCheck) {
        for (Pattern pattern : patterns) {
            Matcher matcher = pattern.matcher(path);
            if (matcher.matches()) {
                if (Collections.disjoint(permissions, permissionsToCheck)) {
                    return false;
                }
            }
        }

        return true;
    }

    private boolean isAdminLockedEndPoints(String path) {
        return 
            path.contains("import") || 
            path.contains("export") || 
            path.equals("/api/users") || 
            path.startsWith("/api/permissions/role");
    }
}
