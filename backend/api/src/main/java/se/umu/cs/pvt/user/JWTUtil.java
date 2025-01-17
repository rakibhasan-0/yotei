package se.umu.cs.pvt.user;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

/**
 * Utility class for creating and verifying Json Web Tokens.
 * 
 * @author Team Hot-Pepper (G7) (Doc: Grupp 2 Griffin c17wfn) & Team Tomato
 *         Team Mango (Grupp 4) - 2024-05-17
 * @updated 2024-04-23 by Team Tomato
 */
@Component
public class JWTUtil {

    /**
     * The SECRET salt for generating and validating Json Web Tokens.
     */
    private final String secret = "PVT";

    /**
     * The time a token is valid in milliseconds.
     */
    private final long validDuration = 1000L * 60 * 60 * 24;

    /**
     * Generates a Json Web Token with the given username as the payload claim.
     * 
     * @param username Username to be put in payload.
     * @param role     Role of the user
     * @param userId   the id of the user
     * @return The Json Web Token.
     * @throws IllegalArgumentException Bad argument.
     * @throws JWTCreationException     Something went wrong during the signing
     *                                  process.
     */
    public String generateToken(String username, int userId, List<Long> permissions)
            throws IllegalArgumentException, JWTCreationException {
        return JWT.create()
                .withSubject("User Details")
                .withClaim("username", username)
                .withClaim("userId", userId)
                .withClaim("permissions", permissions)
                .withIssuedAt(new Date())
                .withIssuer("PVT/User")
                .withExpiresAt(new Date(System.currentTimeMillis() + validDuration))
                .sign(Algorithm.HMAC256(secret));
    }

    /**
     * Verifies the validity of the given Json Web Token.
     * 
     * @param token The Json Web Token.
     * @return The decoded Json Web Token.
     * @throws JWTVerificationException The Json Web Token was not valid.
     */
    public DecodedJWT validateToken(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("PVT/User")
                .build();
        return verifier.verify(token);
    }

    /**
     * Validates the token and returns the userId
     * 
     * @param token The JSON Web Token
     * @return The userId of the user that the token belongs to
     * @throws JWTVerificationException The JSON Web token was not vaild.
     */
    public int getUserIdFromToken(String token) throws JWTVerificationException {
        DecodedJWT jwt = validateToken(token);
        return jwt.getClaim("userId").asInt();
    }

}
