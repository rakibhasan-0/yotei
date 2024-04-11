package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import se.umu.cs.pvt.search.params.SearchPlanParams;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for SearchTechniquesParams
 *
 * @author Jonas Gustavsson (Kraken)
 * date: 2023-05-16
 */
public class PlanParamsTest {
    SearchPlanParams params;

    @BeforeEach
    void init() {
        Map map = new HashMap<>();
        map.put("id","testID");
        map.put("from","2010-10-20");
        map.put("to","2011-01-14");
        map.put("previousSessions","true");
        map.put("plans","plan1,plan2,plan3");
        params = new SearchPlanParams(map);
    }

    @Test
    void isNotNull() {
        assertThat(params).isNotNull();
    }

    @Test
    void hasToTest() {
        assertThat(params.hasTo()).isTrue();
    }

    @Test
    void hasFromTest() {
        assertThat(params.hasFrom()).isTrue();
    }

    @Test
    void hasIdTest() {
        assertThat(params.hasId()).isTrue();
    }

    @Test
    void hasPlansTest() {
        assertThat(params.hasPlans()).isTrue();
    }

    @Test
    void hasPreviousSessionsTest() {
        assertThat(params.hasPreviousSessions()).isTrue();
    }

    @Test
    void hasToTestShouldBeFalse() {
        params = new SearchPlanParams(new HashMap<>());
        assertThat(params.hasTo()).isFalse();
    }

    @Test
    void hasFromTestShouldBeFalse() {
        params = new SearchPlanParams(new HashMap<>());
        assertThat(params.hasFrom()).isFalse();
    }

    @Test
    void hasIdTestShouldBeFalse() {
        params = new SearchPlanParams(new HashMap<>());
        assertThat(params.hasId()).isFalse();
    }

    @Test
    void hasPlansTestShouldBeFalse() {
        params = new SearchPlanParams(new HashMap<>());
        assertThat(params.hasPlans()).isFalse();
    }

    @Test
    void hasPreviousSessionsTestShouldBeFalse() {
        params = new SearchPlanParams(new HashMap<>());
        assertThat(params.hasPreviousSessions()).isFalse();
    }

    @Test
    void badDateTest() {
        Map map = new HashMap<>();
        map.put("from", "lool-13-37");
        map.put("to", "2022/10/10");
        params = new SearchPlanParams(map);

        assertThat(params.hasTo()).isFalse();
        assertThat(params.hasFrom()).isFalse();
    }

    @Test
    void badBooleanParseTest() {
        Map map = new HashMap<>();
        map.put("previousSessions", "VeRyTrUe");
        params = new SearchPlanParams(map);

        assertThat(params.hasPreviousSessions()).isFalse();
    }
}
