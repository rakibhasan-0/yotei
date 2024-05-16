package se.umu.cs.pvt.technique;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.*;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterAll;
import java.nio.file.Paths;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.core.env.MapPropertySource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.testcontainers.utility.DockerImageName;
import org.testcontainers.utility.MountableFile;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.ImageFromDockerfile;

import java.time.Duration;

public class TechniqueDatabaseTest {
    private static PostgreSQLContainer<?> postgreSQLContainer;
    private static final String DOCKER_IMAGE_NAME = "yotei-psql";
    private static final String POSTGRESQL_USER = "psql";
    private static final String POSTGRESQL_PASSWORD = "yotei123";
    private static final String POSTGRESQL_DATABASE = "yotei";

    @BeforeAll
    public static void setUp() {
        ImageFromDockerfile image = new ImageFromDockerfile()
            .withDockerfile(Paths.get("../../infra/database/Dockerfile"));

        DockerImageName imageName = DockerImageName.parse(image.get())
            .asCompatibleSubstituteFor(PostgreSQLContainer.IMAGE);
        
        //DockerImageName imgName = DockerImageName.parse(DOCKER_IMAGE_NAME).asCompatibleSubstituteFor("postgres");

        postgreSQLContainer = new PostgreSQLContainer<>(imageName)
        .withDatabaseName(POSTGRESQL_DATABASE)
        .withUsername(POSTGRESQL_USER)
        .withPassword(POSTGRESQL_PASSWORD)
        .withEnv("POSTGRESQL_DATABASE", POSTGRESQL_DATABASE)
        .withEnv("POSTGRESQL_USER", POSTGRESQL_USER)
        .withEnv("POSTGRESQL_PASSWORD", POSTGRESQL_PASSWORD)
        .withExposedPorts(PostgreSQLContainer.POSTGRESQL_PORT);

        postgreSQLContainer.setWaitStrategy(Wait.defaultWaitStrategy()
                .withStartupTimeout(Duration.ofSeconds(60)));
        
        postgreSQLContainer.start();
    }

    @AfterAll
    public static void tearDown() {
        if (postgreSQLContainer != null) {
            postgreSQLContainer.stop();
        }
    }

    @Test
    public void testDatabaseInitialization() throws Exception {
        //String jdbcUrl = "jdbc:postgresql://localhost:5432/yotei";

        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
                Statement statement = connection.createStatement()) {

            ResultSet resultSet = statement.executeQuery("SELECT belt_name FROM belt;");

            if (resultSet.next()) {
                String name = resultSet.getString("belt_name");
                assertEquals("Grundläggande Tekniker", name);
            }
        }
    }

    @Test
    public void testYellowBelts() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
                Statement statement = connection.createStatement()) {

            ResultSet resultSet = statement.executeQuery("SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = 'Empi uchi, jodan och chudan (1 Kyu)';");

            if (resultSet.next()) {
                String belt = resultSet.getString("belt_name");
                assertEquals("Brunt", belt);
            }
        }
    }

    
    @Test
    public void sampleTestsBelts() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
                Statement statement = connection.createStatement()) {
            
            String techName = "Empi uchi, jodan och chudan (1 Kyu)";
            String expectedColor = "Brunt";
            String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
            
            
            PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, techName);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                String belt = resultSet.getString("belt_name");
                assertEquals(expectedColor, belt);
            }
        }
    }
}
