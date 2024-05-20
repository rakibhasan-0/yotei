package se.umu.cs.pvt.technique;

import java.sql.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.AfterAll;
import java.nio.file.Paths;
import java.io.IOException;
import java.nio.file.Files;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.utility.DockerImageName;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.ImageFromDockerfile;

import java.time.Duration;
import java.util.HashMap;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
 * This test-class will likely cause problems if not excluded from being ran by maven. If you do want to run it locally, you need
 * to have a .env-file with information regarding the database in the project root.
 * 
 * @author Kiwi (Grupp 2), c16kvn & dv22cen 2024-05-16
 */
public class TechniqueDatabaseTest {
    private static PostgreSQLContainer<?> postgreSQLContainer;

    static String POSTGRESQL_USER;
    static String POSTGRESQL_PASSWORD;
    static String POSTGRESQL_DATABASE;


    @BeforeAll
    public static void setUp() {
        //We go into the .env in the project root and find the password etc. for the database
        try {
            String envFilePath = "../../.env";
            String envFileContent = new String(Files.readAllBytes(Paths.get(envFilePath)));

            // Regex for finding key-value pair
            Pattern pattern = Pattern.compile("^([^=]+)=(.*)$", Pattern.MULTILINE);
            Matcher matcher = pattern.matcher(envFileContent);
            Map<String, String> envVariables = new HashMap<>();

            while (matcher.find()) {
                String key = matcher.group(1);
                String value = matcher.group(2);
                // Trim away quotes
                value = value.replaceAll("^\"|\"$", "");
                envVariables.put(key, value);
            }
            POSTGRESQL_USER = envVariables.get("POSTGRES_USER");
            POSTGRESQL_PASSWORD = envVariables.get("POSTGRES_PASSWORD");
            POSTGRESQL_DATABASE = envVariables.get("POSTGRES_DB");

        } catch (IOException e) {
            e.printStackTrace();
        }

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

        //NOTE: We had to increase the timer to 120 rather than 60, which is wierd as both should work.
        postgreSQLContainer.setWaitStrategy(Wait.defaultWaitStrategy()
                .withStartupTimeout(Duration.ofSeconds(120)));
        
        postgreSQLContainer.start();
    }

    @AfterAll
    public static void tearDown() {
        if (postgreSQLContainer != null) {
            postgreSQLContainer.stop();
        }
    }

    @Test
    public void testTechniqueIDS() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        int yellowBegin = 1;
        int yellowEnd = 25;

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique
                String expectedColor = "Gult";

                for(Integer i = yellowBegin; i < yellowEnd + 1; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.technique_id = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setInt(1, i);

                    ResultSet resultSet = preparedStatement.executeQuery();

                    if (resultSet.next()) {
                        String belt = resultSet.getString("belt_name");
                        assertEquals(expectedColor, belt);
                    }
                }
        }
    }

    /*The following set of tests sample a few techniques to ensure that they're connected to their respective belt*/
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
    public void testYellowBeltsToTechniques() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique
                String[] techNames = {"Knivhot mot magen, grepp, shotei uchi jodan", "Grepp i två handleder framifrån, frigöring"};
                String expectedColor = "Gult";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();
                    //If the given technique doesn't exist, we got null from 'resultSet'
                    assertEquals(resultSet.next(), true);
                    String belt = resultSet.getString("belt_name");
                    assertEquals(expectedColor, belt);
                }
        }
    }

    @Test
    public void testGreenBeltsToTechniques() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique
                String[] techNames = {"Grepp i två handleder framifrån, Shiho nage, shiho nage gatame", "Knivhot mot halsen, höger sida, grepp, kin geri"};
                String expectedColor = "Grönt";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();
                    //If the given technique doesn't exist, we got null from 'resultSet'
                    assertEquals(resultSet.next(), true);
                    String belt = resultSet.getString("belt_name");
                    assertEquals(expectedColor, belt);
                }
        }
    }

    @Test
    public void testBlueBeltsToTechniques() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique            
                String[] techNames = {"Grepp och knivhot mot magen, grepp, kin geri, kote gaeshi, ude hishigi hiza gatame", "Stryptag från sidan med tryck, kote hineri, ude henkan gatame"};
                String expectedColor = "Blått";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();
                    //If the given technique doesn't exist, we got null from 'resultSet'
                    assertEquals(resultSet.next(), true);
                    String belt = resultSet.getString("belt_name");
                    assertEquals(expectedColor, belt);
                }
        }
    }


    @Test
    public void testBrownBeltsToTechniques() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique            
                String[] techNames = {"Grepp i håret med 2 händer och knästöt, gedan juji uke, waki gatame, ude osae gatame", "Knivhot mot halsen bakifrån med vänster arm, maesabaki, kuzure ude garami, kote gaeshi, ude hishigi hiza gatame"};
                String expectedColor = "Brunt";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();
                    //If the given technique doesn't exist, we got null from 'resultSet'
                    assertEquals(resultSet.next(), true);
                    String belt = resultSet.getString("belt_name");
                    assertEquals(expectedColor, belt);
                }
        }
    }

    @Test
    public void testOrangeBeltsToTechniques() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique            
                String[] techNames = {"Grepp i en handled framifrån med två händer med drag, frigöring", "Knivhot mot magen, grepp, shotei uchi jodan, kote gaeshi, ude hishigi hiza gatame"};
                String expectedColor = "Orange";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();
                    //If the given technique doesn't exist, we got null from 'resultSet'
                    assertEquals(resultSet.next(), true);
                    String belt = resultSet.getString("belt_name");
                    assertEquals(expectedColor, belt);
                }
        }
    }

    @Test
    public void testBlackBeltsToTechniques() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique            
                String[] techNames = {"Haito uchi, jodan (1 Dan)", "Gripa liggande, Vända liggande - Kuzure kote gaeshi gatame"};
                String expectedColor = "Svart";

                for(int i = 0; i < 2; i++){
                    String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                    PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                    preparedStatement.setString(1, techNames[i]);

                    ResultSet resultSet = preparedStatement.executeQuery();
                    //If the given technique doesn't exist, we got null from 'resultSet'
                    assertEquals(resultSet.next(), true); 
                    String belt = resultSet.getString("belt_name");
                    assertEquals(expectedColor, belt);
                }
        }
    }
}
