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
 * This is essentially tests for the database init scripts.
 * 
 * A few new belts had to be added to the project, potentially messing things up within the database. To ensure
 * no problems occured a test-suite was created that builds a temporary container with a database using
 * the 'init.sql' script. The database is then queried to see if it builds as expected. 
 * 
 * The tool to create a temporary database does so by creating its own container where the tests are executed. If
 * one is looking to integrate these tests within a CI-pipeline, special precautions might have to be taken.
 * 
 *
 * @author Kiwi (Grupp 2), c16kvn & dv22cen 2024-05-16
 */
public class TechniqueDatabaseTest {
    private static PostgreSQLContainer<?> postgreSQLContainer;
    private static final String DOCKER_IMAGE_NAME = "yotei-psql";
    private static final String POSTGRESQL_USER = "psql";
    private static final String POSTGRESQL_PASSWORD = "yotei123";
    private static final String POSTGRESQL_DATABASE = "yotei";


    @Test
    public void testDummy() {
        
    }

    @BeforeAll
    public static void setUp() {
        ImageFromDockerfile image = new ImageFromDockerfile()
            .withDockerfile(Paths.get("../../infra/database/Dockerfile"));

        DockerImageName imageName = DockerImageName.parse(image.get())
            .asCompatibleSubstituteFor(PostgreSQLContainer.IMAGE);
        
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

    // @AfterAll
    // public static void tearDown() {
    //     if (postgreSQLContainer != null) {
    //         postgreSQLContainer.stop();
    //     }
    // }

    // /*The following set of tests sample a few techniques to ensure that they're connected to their respective belt*/
    // @Test
    // public void testBasicTechniques() throws Exception {
    //     //String jdbcUrl = "jdbc:postgresql://localhost:5432/yotei";

    //     String jdbcUrl = postgreSQLContainer.getJdbcUrl();
    //     String username = postgreSQLContainer.getUsername();
    //     String password = postgreSQLContainer.getPassword();

    //     try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
    //             Statement statement = connection.createStatement()) {

    //         ResultSet resultSet = statement.executeQuery("SELECT belt_name FROM belt;");

    //         if (resultSet.next()) {
    //             String name = resultSet.getString("belt_name");
    //             assertEquals("Grundläggande Tekniker", name);
    //         }
    //     }
    // }

    // @Test
    // public void testYellowBeltsToTechniques() throws Exception {
    //     String jdbcUrl = postgreSQLContainer.getJdbcUrl();
    //     String username = postgreSQLContainer.getUsername();
    //     String password = postgreSQLContainer.getPassword();

    //     try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
    //         Statement statement = connection.createStatement()) {
    //             //This is where you edit if you wish to swap belts/technique
    //             String[] techNames = {"Kamae, neutral (5 Kyu)", "Stryptag framifrån och svingslag, backhand, Frigöring - Ju morote jodan uke, ude osae, ude osae gatame"};
    //             String expectedColor = "Gult";

    //             for(int i = 0; i < 2; i++){
    //                 String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
    //                 PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
    //                 preparedStatement.setString(1, techNames[i]);

    //                 ResultSet resultSet = preparedStatement.executeQuery();

    //                 if (resultSet.next()) {
    //                     String belt = resultSet.getString("belt_name");
    //                     assertEquals(expectedColor, belt);
    //                 }
    //             }
    //     }
    // }

    // @Test
    // public void testGreenBeltsToTechniques() throws Exception {
    //     String jdbcUrl = postgreSQLContainer.getJdbcUrl();
    //     String username = postgreSQLContainer.getUsername();
    //     String password = postgreSQLContainer.getPassword();

    //     try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
    //         Statement statement = connection.createStatement()) {
    //             //This is where you edit if you wish to swap belts/technique
    //             String[] techNames = {"Grepp i två handleder framifrån, Shiho nage, shiho nage gatame", " Randori mot en motståndare (3 Kyu)"};
    //             String expectedColor = "Grönt";

    //             for(int i = 0; i < 2; i++){
    //                 String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
    //                 PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
    //                 preparedStatement.setString(1, techNames[i]);

    //                 ResultSet resultSet = preparedStatement.executeQuery();

    //                 if (resultSet.next()) {
    //                     String belt = resultSet.getString("belt_name");
    //                     assertEquals(expectedColor, belt);
    //                 }
    //             }
    //     }
    // }

    // @Test
    // public void testBlueBeltsToTechniques() throws Exception {
    //     String jdbcUrl = postgreSQLContainer.getJdbcUrl();
    //     String username = postgreSQLContainer.getUsername();
    //     String password = postgreSQLContainer.getPassword();

    //     try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
    //         Statement statement = connection.createStatement()) {
    //             //This is where you edit if you wish to swap belts/technique            
    //             String[] techNames = {"Otoshi ukemi (2 Kyu)", "Påkslag mot huvudet, backhand, Ju jodan uchi uke, irimi nage - Ude osae, ude osae gatame"};
    //             String expectedColor = "Blått";

    //             for(int i = 0; i < 2; i++){
    //                 String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
    //                 PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
    //                 preparedStatement.setString(1, techNames[i]);

    //                 ResultSet resultSet = preparedStatement.executeQuery();

    //                 if (resultSet.next()) {
    //                     String belt = resultSet.getString("belt_name");
    //                     assertEquals(expectedColor, belt);
    //                 }
    //             }
    //     }
    // }


    // @Test
    // public void testBrownBeltsToTechniques() throws Exception {
    //     String jdbcUrl = postgreSQLContainer.getJdbcUrl();
    //     String username = postgreSQLContainer.getUsername();
    //     String password = postgreSQLContainer.getPassword();

    //     try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
    //         Statement statement = connection.createStatement()) {
    //             //This is where you edit if you wish to swap belts/technique            
    //             String[] techNames = {"Empi uchi, jodan och chudan (1 Kyu)", "Påkslag mot huvudet, forehand och backhand, Tsuri ashi - ju jodan uchi uke, irimi nage, ude hishigi hiza gatame"};
    //             String expectedColor = "Brunt";

    //             for(int i = 0; i < 2; i++){
    //                 String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
    //                 PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
    //                 preparedStatement.setString(1, techNames[i]);

    //                 ResultSet resultSet = preparedStatement.executeQuery();

    //                 if (resultSet.next()) {
    //                     String belt = resultSet.getString("belt_name");
    //                     assertEquals(expectedColor, belt);
    //                 }
    //             }
    //     }
    // }

    // @Test
    // public void testOrangeBeltsToTechniques() throws Exception {
    //     String jdbcUrl = postgreSQLContainer.getJdbcUrl();
    //     String username = postgreSQLContainer.getUsername();
    //     String password = postgreSQLContainer.getPassword();

    //     try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
    //         Statement statement = connection.createStatement()) {
    //             //This is where you edit if you wish to swap belts/technique            
    //             String[] techNames = {"Mae ukemi (4 Kyu)", "Svingslag, Ju morote jodan uke, hiki otoshi - O soto osae, ude henkan gatame"};
    //             String expectedColor = "Orange";

    //             for(int i = 0; i < 2; i++){
    //                 String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
    //                 PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
    //                 preparedStatement.setString(1, techNames[i]);

    //                 ResultSet resultSet = preparedStatement.executeQuery();

    //                 if (resultSet.next()) {
    //                     String belt = resultSet.getString("belt_name");
    //                     assertEquals(expectedColor, belt);
    //                 }
    //             }
    //     }
    // }

    // @Test
    // public void testBlackBeltsToTechniques() throws Exception {
    //     String jdbcUrl = postgreSQLContainer.getJdbcUrl();
    //     String username = postgreSQLContainer.getUsername();
    //     String password = postgreSQLContainer.getPassword();

    //     try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
    //         Statement statement = connection.createStatement()) {
    //             //This is where you edit if you wish to swap belts/technique            
    //             String[] techNames = {"Haito uchi, jodan (1 Dan)", "Gripa liggande, Vända liggande - Kuzure kote gaeshi gatame"};
    //             String expectedColor = "Svart";

    //             for(int i = 0; i < 2; i++){
    //                 String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
    //                 PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
    //                 preparedStatement.setString(1, techNames[i]);

    //                 ResultSet resultSet = preparedStatement.executeQuery();

    //                 if (resultSet.next()) {
    //                     String belt = resultSet.getString("belt_name");
    //                     assertEquals(expectedColor, belt);
    //                 }
    //             }
    //     }
    // }

    /*This */
}
