package se.umu.cs.pvt.gateway;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.deser.DataFormatReaders.Match;

import ch.qos.logback.classic.Level;

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
	    TEHCNIQUE_EXERCISE_OWN(8),
	    TEHCNIQUE_EXERCISE_ALL(9),
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

        //System.err.println("permissions: " + permissions);
        //Logger.log(Level.DEBUG, "permissions: " + permissions);
        
        if (role.equals("ADMIN") || permissions.contains(permissionList.ADMIN_RIGHTS.value)) {
            return true;
        }
        
        //throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "permissions: " + permissions + "\nadmin right: " + permission_list.ADMIN_RIGHTS.value);
        
        // Check for each permission-locked api path and determine if user is allowed through
        if (path.startsWith("/api/session") 
            && !checkSessionPermissions(path, permissions)) return false;

        if (path.startsWith("/api/plan")
            && !checkPlanPermissions(path, permissions)) return false;

        if ((path.startsWith("/api/techniques") || path.startsWith("/api/exercises"))
            && !checkTechniqueExercisePermissions(path, permissions)) return false;

        if (path.startsWith("/api/examination")
            && !checkGradingPermissions(path, permissions)) return false;

        // Protect import and export endpoints
        // Only allow admin to create users
        return !(path.contains("import") || path.contains("export") || path.equals("/api/users"));

    }

    private boolean checkSessionPermissions(String path, List<Integer> permissions) {
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

    private boolean checkPlanPermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From PlanController
            Pattern.compile("^/api/plan/add$"),
            Pattern.compile("^/api/plan/remove$"),
            Pattern.compile("^/api/plan/update$"),
        };
    
        Integer[] permissionsToCheck = {
            permissionList.PLAN_ALL.value,
            permissionList.PLAN_OWN.value
        };

        return hasPermission(path, permissions, Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    private boolean checkTechniqueExercisePermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From TechniqueController
            // TODO: This should only be valid for the POST and PUT method
            Pattern.compile("^/api/techniques$"),
            Pattern.compile("^/api/techniques/\\d+$"),
            // TODO: Only for the POST, DELETE and PUT methods
            Pattern.compile("^/api/techniques/reviews$"),
            // From ExerciseController
            Pattern.compile("^/api/exercises/add$"),
            Pattern.compile("^/api/exercises/add/update$"),
            Pattern.compile("^/api/exercises/add/remove/\\d+$"),
            Pattern.compile("^/api/exercises/add/image$")
        };
    
        Integer[] permissionsToCheck = {
            permissionList.TEHCNIQUE_EXERCISE_ALL.value,
            permissionList.TEHCNIQUE_EXERCISE_OWN.value
        };

        return hasPermission(path, permissions, Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    private boolean checkGradingPermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From ExaminationController
            Pattern.compile("^/api/examination/grading$"),
            Pattern.compile("^/api/examination/grading/\\d+$"),
            Pattern.compile("^/api/examination/examinee$"),
            Pattern.compile("^/api/examination/examinee/\\d+$"),
            Pattern.compile("^/api/examination/pair$"),
            Pattern.compile("^/api/examination/pair/\\d+$"),
            Pattern.compile("^/api/examination/comment$"),
            Pattern.compile("^/api/examination/comment/\\d+$"),
            Pattern.compile("^/api/examination/examresult$"),
            Pattern.compile("^/api/examination/examresult/\\d+$")
        };
    
        Integer[] permissionsToCheck = {
            permissionList.GRADING_ALL.value,
            permissionList.GRADING_OWN.value
        };

        return hasPermission(path, permissions, Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
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
}
