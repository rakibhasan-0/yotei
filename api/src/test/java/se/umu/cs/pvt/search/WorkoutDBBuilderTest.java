package se.umu.cs.pvt.search;

import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchWorkoutDBBuilder;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Test class for SearchWorkoutDBBuilder
 *
 * @author Jonas Gustavsson
 * date: 2023-05-03
 */
public class WorkoutDBBuilderTest {
    SearchWorkoutParams params;
    SearchWorkoutDBBuilder builder;

    @Test
    void isNotNull(){
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of workout");

        params = new SearchWorkoutParams(urlQuery);
        builder = new SearchWorkoutDBBuilder(params);
        assertThat(builder).isNotNull();
    }

    @Test
    void filterAllDefaultParams(){
        Map<String, String> urlQuery = new HashMap<>();

        params = new SearchWorkoutParams(urlQuery);
        builder = new SearchWorkoutDBBuilder(params);

        String expectedQuery = "SELECT workout_name, workout_id FROM workout";

        assertThat(builder
                .filterByDate()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

    @Test
    void filterByDate(){
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of workout");
        urlQuery.put("date", "2020-11-24");

        params = new SearchWorkoutParams(urlQuery);
        builder = new SearchWorkoutDBBuilder(params);

        String expectedQuery = "SELECT workout_name, workout_id FROM workout WHERE workout_created='2020-11-24'";

        assertThat(builder
                .filterByDate()
                .build().getQuery()).isEqualTo(expectedQuery);
    }
}
