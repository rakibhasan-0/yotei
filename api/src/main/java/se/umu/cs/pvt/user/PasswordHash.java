package se.umu.cs.pvt.user;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

/**
 * The class handles the hashing of passwords.
 * @author Team Hot-Pepper (G7) (Doc: Grupp 2 Griffin c17wfn)
 */

public class PasswordHash {

    /**
     * Hashes the password and adds a random generated salt to it. The function returns
     * the amount of iterations the password has been hashed, the random generated salt
     * and the hashed password separated by a colon (:).
     * @param passwordToHash The password to be hashed.
     * @return Amount of iterations : salt : the hashed password.
     * @throws NoSuchAlgorithmException Thrown when the requested Cryptographic algorithm isn't available in the 
     *                                  environment.
     * @throws InvalidKeySpecException Thrown when an invalid key specification is given.
     */
    public static String hashPassword(String passwordToHash) throws NoSuchAlgorithmException, InvalidKeySpecException {
        String hashedPassword;
        int iterations = 1000;
        char[] chars = passwordToHash.toCharArray();

        byte[] salt = getSalt();
        // Make it usable with password based encryption
        PBEKeySpec spec = new PBEKeySpec(chars, salt, iterations, 64 * 8);
        // Used to convert keys into key specifications and vice versa.
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        // Hash the password
        byte[] hash = skf.generateSecret(spec).getEncoded();
        hashedPassword = iterations + ":" + toHex(salt) + ":" + toHex(hash);

        return hashedPassword;
    }

    /**
     * Generates a random salt.
     * @return The salt.
     * @throws NoSuchAlgorithmException thrown if the algorithm used is not available.
     */
    private static byte[] getSalt() throws NoSuchAlgorithmException {
        SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[16];
        // Get a random salt
        sr.nextBytes(salt);
        return salt;
    }

    /**
     * Converts a byte array to its hexadecimal representation.
     * @param array The byte array.
     * @return The hexadecimal representation.
     */
    private static String toHex(byte[] array) {
        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);

        int paddingLength = (array.length * 2) - hex.length();
        if (paddingLength > 0) {
            return String.format("%0" + paddingLength + "d", 0) + hex;
        } else {
            return hex;
        }
    }

    /**
     * Validates a password against a hashed password.
     * @param inputPassword The password to validate.
     * @param storedPassword The hashed password.
     * @return True if the passwords match, otherwise false.
     * @throws NoSuchAlgorithmException Thrown when the algorithm used is not available.
     * @throws InvalidKeySpecException Thrown if a key being used cannot be created.
     */
    public static boolean validatePassword(String inputPassword, String storedPassword)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        // splits the hash from the salt
        String[] parts = storedPassword.split(":");
        int iterations = Integer.parseInt(parts[0]);

        byte[] salt = fromHex(parts[1]);
        byte[] hash = fromHex(parts[2]);

        PBEKeySpec spec = new PBEKeySpec(inputPassword.toCharArray(),
                salt, iterations, hash.length * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] testHash = skf.generateSecret(spec).getEncoded();

        int diff = hash.length ^ testHash.length;

        for (int i = 0; i < hash.length && i < testHash.length; i++) {
            diff |= hash[i] ^ testHash[i];
        }
        return diff == 0;
    }

    /**
     * Coverts a hexadecimal representation of a String into a decimal representation.
     * @param hex The String.
     * @return The decimal representation.
     */
    private static byte[] fromHex(String hex) {
        byte[] bytes = new byte[hex.length() / 2];

        for (int i = 0; i < bytes.length ;i++) {
            bytes[i] = (byte)Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }

        return bytes;
    }
}