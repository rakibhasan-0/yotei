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


/**
 * 
 * This is essencially tests for the database init scripts.
 * 
 * A few new belts had to be added to the project, potentially messing things up within the database. To ensure
 * no problems occured a test-suite was created that builds a temporary container with a database using
 * the 'init.sql' script. The database is then queried to see if it builds as expected. 
 *
 * @author Kiwi (Grupp 2), c16kvn & dv22cen 2024-05-16
 */
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
    public void testBasicTechniques() throws Exception {
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
            
                String[] techNames = {"Kamae, neutral (5 Kyu)", "Stryptag framifrån och svingslag, backhand, Frigöring - Ju morote jodan uke, ude osae, ude osae gatame"};
                String expectedColor = "Gult";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();

                    if (resultSet.next()) {
                        String belt = resultSet.getString("belt_name");
                        assertEquals(expectedColor, belt);
                    }
                }
        }
    }

    @Test
    public void testGreenBelts() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
            
                String[] techNames = {"Grepp i två handleder framifrån, Shiho nage, shiho nage gatame", " Randori mot en motståndare (3 Kyu)"};
                String expectedColor = "Grönt";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();

                    if (resultSet.next()) {
                        String belt = resultSet.getString("belt_name");
                        assertEquals(expectedColor, belt);
                    }
                }
        }
    }

    @Test
    public void testBlueBelts() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
            
                String[] techNames = {"Otoshi ukemi (2 Kyu)", "Påkslag mot huvudet, backhand, Ju jodan uchi uke, irimi nage - Ude osae, ude osae gatame"};
                String expectedColor = "Blått";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();

                    if (resultSet.next()) {
                        String belt = resultSet.getString("belt_name");
                        assertEquals(expectedColor, belt);
                    }
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
            
            /*BROWN BELT TECHNIQUES*/
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

            techName = "Påkslag mot huvudet, forehand och backhand, Tsuri ashi - ju jodan uchi uke, irimi nage, ude hishigi hiza gatame";
            expectedColor = "Brunt";
            sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
            
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, techName);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                String belt = resultSet.getString("belt_name");
                assertEquals(expectedColor, belt);
            }

            /*ORANGE BELT TECHNIQUES*/
            techName = "Mae ukemi (4 Kyu)";
            expectedColor = "Orange";
            sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
            
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, techName);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                String belt = resultSet.getString("belt_name");
                assertEquals(expectedColor, belt);
            }
            techName = "Svingslag, Ju morote jodan uke, hiki otoshi - O soto osae, ude henkan gatame";
            expectedColor = "Orange";
            sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
            
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, techName);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                String belt = resultSet.getString("belt_name");
                assertEquals(expectedColor, belt);
            }

            /*BLACK BELT TECHNIQUES*/
            techName = "Haito uchi, jodan (1 Dan)";
            expectedColor = "Svart";
            sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
            
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, techName);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                String belt = resultSet.getString("belt_name");
                assertEquals(expectedColor, belt);
            }
            techName = "Gripa liggande, Vända liggande - Kuzure kote gaeshi gatame";
            expectedColor = "Svart";
            sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
            
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, techName);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                String belt = resultSet.getString("belt_name");
                assertEquals(expectedColor, belt);
            }
        }
    }
}
