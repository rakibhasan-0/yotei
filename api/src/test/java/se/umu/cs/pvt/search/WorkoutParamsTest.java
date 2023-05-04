package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for SearchWorkoutParams
 *
 * @author Jonas Gustavsson
 * date: 2023-05-03
 */
public class WorkoutParamsTest {
    SearchWorkoutParams params;

    @BeforeEach
    void init() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of workout");
        urlQuery.put("from", "2020-02-20");
        urlQuery.put("to", "2020-02-25");

        params = new SearchWorkoutParams(urlQuery);
    }

    @Test
    void isNotNull() {
        assertThat(params).isNotNull();
    }

    @Test
    void getNameTest() {
        assertThat(params.getName()).isEqualTo("name of workout");
    }

    @Test
    void hasNameTestShouldBeTrue() {
        assertThat(params.hasName()).isTrue();
    }

    @Test
    void hasNameTestShouldBeFalse() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("date", "2020-02-20");

        params = new SearchWorkoutParams(urlQuery);
        assertThat(params.hasName()).isFalse();
    }

    @Test
    void getFromTest() {
        LocalDate date = LocalDate.of(2020, 02,20);

        assertThat(params.getFrom().isEqual(date)).isTrue();
    }

    @Test
    void badFromTest() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of workout");
        urlQuery.put("from", "2020/02/20");
        params = new SearchWorkoutParams(urlQuery);

        assertThat(params.hasFrom()).isFalse();
    }

    @Test
    void hasDateTestShouldBeTrue() {
        assertThat(params.hasFrom()).isTrue();
    }

    @Test
    void hasDateTestShouldBeFalse() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "name of workout");
        params = new SearchWorkoutParams(urlQuery);

        assertThat(params.hasFrom()).isFalse();
    }
}
