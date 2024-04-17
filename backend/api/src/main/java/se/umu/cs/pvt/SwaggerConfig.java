package se.umu.cs.pvt;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

/**
 * Configuration class for Swagger. Enables Swagger UI on http://localhost:8085/swagger-ui/index.html
 * and api documentation on json-format on http://localhost:8085/v3/api-docs
 * @author Lee Lannerblad, ens19lld 2024-04-17
 */
@Configuration
@Profile({"!prod"})
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().info(new Info().title("Yotei API")
            .description("Swagger UI for Yotei application. Interact with the api's endpoints during development.")
            .version("v0.0.1"));
    }
}
