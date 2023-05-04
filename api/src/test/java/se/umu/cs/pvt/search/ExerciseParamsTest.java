package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for SearchExerciseParams
 *
 * @author Jonas Gustavsson
 * date: 2023-05-03
 */
public class ExerciseParamsTest {
    SearchExerciseParams params;
    @BeforeEach
    void init() {

        Map<String, String> param = new HashMap<>();
        param.put("name","name of exercise");
        param.put("tags", "tag1,tag2,tag3");

        params = new SearchExerciseParams(param);

    }


    @Test
    void isNotNull() {
        assertThat(params).isNotNull();
    }

    @Test
    void getNameTest() {
        assertThat(params.getName()).isEqualTo("name of exercise");
    }

    @Test
    void hasNameTestShouldBeTrue() {
        assertThat(params.hasName()).isTrue();
    }

    @Test
    void hasNameTestShouldBeFalse() {
        params = new SearchExerciseParams(new HashMap<>());

        assertThat(params.hasName()).isFalse();
    }

    @Test
    void getTagsTest() {
        assertThat(params.getTags().get(1)).isEqualTo("tag2");
    }

    @Test
    void hasTagsTestShouldBeTrue() {
        assertThat(params.hasTags()).isTrue();
    }

    @Test
    void hasTagsTestShouldBeFalse() {
        params = new SearchExerciseParams(new HashMap<>());

        assertThat(params.hasTags()).isFalse();
    }
}
