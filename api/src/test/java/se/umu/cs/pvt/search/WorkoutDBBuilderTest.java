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

        String expectedQuery = "SELECT result.workout_name, result.workout_id, 1=2 AS favourite FROM ( " +
                "SELECT workout_name, workout_id FROM workout ) AS result";

        assertThat(builder
                .filterByDate()
                .build().getQuery()).isEqualTo(expectedQuery);
    }
}
