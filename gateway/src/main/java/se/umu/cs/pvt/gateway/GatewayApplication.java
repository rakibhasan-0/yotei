package se.umu.cs.pvt.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Never write any code in this file, use the application.yml to add new routes.
 */

@SpringBootApplication
public class GatewayApplication {

    /**
     * Starts the springboot service.
     * @param args Program arguments
     */
    public static void main(final String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }



}
