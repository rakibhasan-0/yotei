package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchTagsDBBuilder;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Test class for SearchTagsDBBuilder
 *
 * @author (Kraken) Jonas Gustavsson
 * date: 2023-05-04
 */

public class TagDBBuilderTest {

    SearchTagsParams params;
    SearchTagsDBBuilder builder;

    @BeforeEach
    void init() {
        Map<String, String> query = new HashMap<>();
        query.put("tags", "katt,kniv");
        query.put("name", "tag");
        query.put("tagAmount", "10");
        params = new SearchTagsParams(query);

        builder = new SearchTagsDBBuilder(params);
    }

    @Test
    void isNotNull() {
        assertThat(builder).isNotNull();
    }

    @Test
    void testNoParameters() {
        Map<String, String> query = new HashMap<>();
        params = new SearchTagsParams(query);
        builder = new SearchTagsDBBuilder(params);

        String expectedQuery = "SELECT tag_id, name FROM tag";

        assertThat(builder.filterByTags().build().getQuery()).isEqualTo(expectedQuery);
    }

    @Test
    void filterByExistingTags(){
        String expectedQuery = "SELECT name, tag_id FROM tag WHERE tag.name NOT IN ('katt','kniv')";

        assertThat(builder
                .filterByTags()
                .build().getQuery()).isEqualTo(expectedQuery);
    }
}
