package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for SearchTechniquesParams
 *
 * @author Jonas Gustavsson (Kraken)
 * date: 2023-05-03
 */
public class TechniquesParamsTest {
    SearchTechniquesParams params;

    @BeforeEach
    void init() {

        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of technique");
        urlQuery.put("tags", "tag1,tag2,tag3");
        urlQuery.put("beltColors", "1,2,3");
        urlQuery.put("technique", "true");
        urlQuery.put("kion", "true");

        params = new SearchTechniquesParams(urlQuery);
    }

    @Test
    void isNotNull() {
        assertThat(params).isNotNull();
    }

    @Test
    void getNameTest() {
        assertThat(params.getName()).isEqualTo("name of technique");
    }

    @Test
    void hasNameTestShouldBeTrue() {
        assertThat(params.hasName()).isTrue();
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
    void getBeltsTest() {
        assertThat(params.getBeltColors().get(1)).isEqualTo("2");
    }

    @Test
    void hasBeltsTestShouldBeTrue() {
        assertThat(params.hasBeltColors()).isTrue();
    }

    @Test
    void isTechniqueTestShouldBeTrue() {
        assertThat(params.isTechnique()).isTrue();
    }

    @Test
    void isKionTestShouldBeTrue() {
        assertThat(params.isKion()).isTrue();
    }
}
