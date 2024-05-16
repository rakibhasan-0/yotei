package se.umu.cs.pvt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main class for the Spring Application.
 * @author Team Hot-Pepper (G7)
 */
@SpringBootApplication
public class ApiApplication
{
    /**
     * Main function for the login application.
     * @param args arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}

