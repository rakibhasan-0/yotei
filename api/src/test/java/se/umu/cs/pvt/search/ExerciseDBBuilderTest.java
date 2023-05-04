package se.umu.cs.pvt.search;

import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchExerciseDBBuilder;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Test class for SearchExerciseDBBuilder
 *
 * @author Jonas Gustavsson
 * date: 2023-05-03
 */

public class ExerciseDBBuilderTest {
    SearchExerciseParams params;
    SearchExerciseDBBuilder builder;

    @Test
    void isNotNull(){
        Map<String, String> param = new HashMap<>();
        param.put("name","name of exercise");
        params = new SearchExerciseParams(param);
        builder = new SearchExerciseDBBuilder(params);
        assertThat(builder).isNotNull();
    }

    @Test
    void filterAllDefaultParams(){
        Map<String, String> param = new HashMap<>();
        params = new SearchExerciseParams(param);
        builder = new SearchExerciseDBBuilder(params);

        String expectedQuery = "SELECT name, exercise_id, duration FROM exercise";

        assertThat(builder
                .filterByTags()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

    @Test
    void filterByTwoTagsTest(){
        Map<String, String> param = new HashMap<>();
        param.put("tags","tag1 tag2");
        params = new SearchExerciseParams(param);
        builder = new SearchExerciseDBBuilder(params);

        String expectedQuery = "SELECT e.name, e.exercise_id, e.duration " +
                "FROM exercise AS e, exercise_tag AS et, tag AS t " +
                "WHERE et.ex_id = e.exercise_id AND et.tag_id = t.tag_id " +
                "AND LOWER(t.name)=LOWER('tag1 tag2')";

        assertThat(builder
                .filterByTags()
                .build().getQuery()).isEqualTo(expectedQuery);
    }
}
