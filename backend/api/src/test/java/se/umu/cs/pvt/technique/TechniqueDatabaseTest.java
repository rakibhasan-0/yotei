package se.umu.cs.pvt.technique;

import java.sql.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

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

import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.LoggerContext;

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
 * @updated Kiwi (Grupp 2), c16kvn & dv22cen 2024-05-20
 */
public class TechniqueDatabaseTest {
    private static PostgreSQLContainer<?> postgreSQLContainer;

    static String POSTGRESQL_USER = System.getProperty("POSTGRESQL_USER");
    static String POSTGRESQL_PASSWORD = System.getProperty("POSTGRESQL_PASSWORD");
    static String POSTGRESQL_DATABASE = System.getProperty("POSTGRESQL_DATABASE");

    static LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();

    //INDICES FOR ALL START AND STOPS OF TECHNIQUES TO EACH BELT IN TECHNIQUES.SQL
    //CHANGE THESE IF THE TESTS FAIL AFTER TECHNIQUES.SQL IS CHANGED
    static int yellowBegin = 1;
    static int yellowEnd = 25;

    static int orangeBegin = 26;
    static int orangeEnd = 49;

    static int greenBegin = 50;
    static int greenEnd = 74;

    static int blueBegin = 75;
    static int blueEnd = 101;

    static int brownBegin = 102;
    static int brownEnd = 134;

    @BeforeAll
    public static void setUp() {
        loggerContext.stop();
        System.out.println("Setting up container");

        //We go into the .env in the project root and find the password etc. for the database
        try {
            if (POSTGRESQL_DATABASE == null) {
                System.out.println("Getting DB credentials");

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
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("Building Image from DockerFile");
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

        System.out.println("Waiting for container to be ready");
        //NOTE: We had to increase the timer to 120 rather than 60, which is wierd as both should work.
        postgreSQLContainer.setWaitStrategy(Wait.defaultWaitStrategy()
                .withStartupTimeout(Duration.ofSeconds(120)));
        System.out.println("Starting container");
        postgreSQLContainer.start();
    }

    @AfterAll
    public static void tearDown() {
        String output = postgreSQLContainer.getLogs();
        if (postgreSQLContainer != null) {
            postgreSQLContainer.stop();
        }
        System.out.println(output);
        loggerContext.start();
        System.out.println("Running Tests!");
    }

    /**
     * These tests use hardcoded id:s to check if techniques in the database are connected to the correct belt.
     * This is silly but since the id:s are auto-generated this is the simplest way to secured the structure of the schema.
     * 
     * ---------IF THESE FAIL----------
     * Check if the id:s of tehcniques are connected correctly to belts in the technique_to_belt table.
     * @throws Exception
     */
    @Test
    public void testYellowTechniqueIDS() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

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

    /**
     * These tests use hardcoded id:s to check if techniques in the database are connected to the correct belt.
     * This is silly but since the id:s are auto-generated this is the simplest way to secured the structure of the schema.
     * 
     * ---------IF THESE FAIL----------
     * Check if the id:s of tehcniques are connected correctly to belts in the technique_to_belt table.
     * @throws Exception
     */
    @Test
    public void testOrangeTechniqueIDS() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique
                String expectedColor = "Orange";

                for(Integer i = orangeBegin; i < orangeEnd + 1; i++){
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

    /**
     * These tests use hardcoded id:s to check if techniques in the database are connected to the correct belt.
     * This is silly but since the id:s are auto-generated this is the simplest way to secured the structure of the schema.
     * 
     * ---------IF THESE FAIL----------
     * Check if the id:s of tehcniques are connected correctly to belts in the technique_to_belt table.
     * @throws Exception
     */
    @Test
    public void testGreenTechniqueIDS() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique
                String expectedColor = "Grönt";

                for(Integer i = greenBegin; i < greenEnd + 1; i++){
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

    /**
     * These tests use hardcoded id:s to check if techniques in the database are connected to the correct belt.
     * This is silly but since the id:s are auto-generated this is the simplest way to secured the structure of the schema.
     * 
     * ---------IF THESE FAIL----------
     * Check if the id:s of tehcniques are connected correctly to belts in the technique_to_belt table.
     * @throws Exception
     */
    @Test
    public void testBlueTechniqueIDS() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique
                String expectedColor = "Blått";

                for(Integer i = blueBegin; i < blueEnd + 1; i++){
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

    /**
     * These tests use hardcoded id:s to check if techniques in the database are connected to the correct belt.
     * This is silly but since the id:s are auto-generated this is the simplest way to secured the structure of the schema.
     * 
     * ---------IF THESE FAIL----------
     * Check if the id:s of tehcniques are connected correctly to belts in the technique_to_belt table.
     * @throws Exception
     */
    @Test
    public void testBrownTechniqueIDS() throws Exception {
        String jdbcUrl = postgreSQLContainer.getJdbcUrl();
        String username = postgreSQLContainer.getUsername();
        String password = postgreSQLContainer.getPassword();

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            Statement statement = connection.createStatement()) {
                //This is where you edit if you wish to swap belts/technique
                String expectedColor = "Brunt";

                for(Integer i = brownBegin; i < brownEnd + 1; i++){
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

                /*TODO: THIS TEST ISN'T FEASIBLE TO DESIGN UNTIL WE HAVE BLACKBELT TECHNIQUES*/
                // for(int i = 0; i < 2; i++){
                //     String sqlQuery = "SELECT belt_name FROM belt INNER JOIN technique_to_belt ttb ON ttb.belt_id = belt.belt_id INNER JOIN technique t ON ttb.technique_id = t.technique_id WHERE t.name = ?";
                
                //     PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                //     preparedStatement.setString(1, techNames[i]);

                //     ResultSet resultSet = preparedStatement.executeQuery();
                //     //If the given technique doesn't exist, we got null from 'resultSet'
                //     assertEquals(resultSet.next(), true); 
                //     String belt = resultSet.getString("belt_name");
                //     assertEquals(expectedColor, belt);
                // }
        }
    }
}
