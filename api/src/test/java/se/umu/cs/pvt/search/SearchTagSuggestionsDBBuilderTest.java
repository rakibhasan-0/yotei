package se.umu.cs.pvt.search;

import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchTagSuggestionsDBBuilder;
import se.umu.cs.pvt.search.enums.TagType;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.ArrayList;
import java.util.List;

/**
 * Test Class for SearchTagSuggestionsDBBuilder
 *
 * @author Kraken (Oskar Westerlund Holmgren) 2023-05-03
 */

public class SearchTagSuggestionsDBBuilderTest {
	SearchTagSuggestionsDBBuilder builder;

	@Test
    void isNotNullExercise(){
        builder = new SearchTagSuggestionsDBBuilder(new ArrayList<String>(), TagType.exercise_tag);
        assertThat(builder).isNotNull();
    }

	@Test
    void isNotNullWorkout(){
        builder = new SearchTagSuggestionsDBBuilder(new ArrayList<String>(), TagType.workout_tag);
        assertThat(builder).isNotNull();
    }

	@Test
    void isNotNullTechniques(){
        builder = new SearchTagSuggestionsDBBuilder(new ArrayList<String>(), TagType.technique_tag);
        assertThat(builder).isNotNull();
    }

	@Test
    void noFilter(){
        builder = new SearchTagSuggestionsDBBuilder(new ArrayList<String>(), TagType.technique_tag);

        String expectedQuery = "SELECT name, tag_id FROM tag";

        assertThat(builder
                .build().getQuery()).isEqualTo(expectedQuery);
    }

	@Test
    void filterByTagTypeTechnique(){
        builder = new SearchTagSuggestionsDBBuilder(new ArrayList<String>(), TagType.technique_tag);

        String expectedQuery = "SELECT tag.name, tag.tag_id FROM tag, technique_tag WHERE tag.tag_id = technique_tag.tag_id GROUP BY tag.tag_id";

        assertThat(builder
				.filterByTagType()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

	@Test
    void filterByTagTypeWorkout(){
        builder = new SearchTagSuggestionsDBBuilder(new ArrayList<String>(), TagType.workout_tag);

        String expectedQuery = "SELECT tag.name, tag.tag_id FROM tag, workout_tag WHERE tag.tag_id = workout_tag.tag_id GROUP BY tag.tag_id";

        assertThat(builder
				.filterByTagType()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

	@Test
    void filterByTagTypeExercise(){
        builder = new SearchTagSuggestionsDBBuilder(new ArrayList<String>(), TagType.exercise_tag);

        String expectedQuery = "SELECT tag.name, tag.tag_id FROM tag, exercise_tag WHERE tag.tag_id = exercise_tag.tag_id GROUP BY tag.tag_id";

        assertThat(builder
				.filterByTagType()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

	@Test
    void filterByExistingTags(){
		List<String> tags = new ArrayList<>();
		tags.add("katt");
		tags.add("kniv");

        builder = new SearchTagSuggestionsDBBuilder(tags, TagType.exercise_tag);

        String expectedQuery = "SELECT name, tag_id FROM tag WHERE tag.name NOT IN ('katt','kniv')";

        assertThat(builder
				.filterByExistingTags()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

	@Test
    void filterByExistingTagsAndTagType(){
		List<String> tags = new ArrayList<>();
		tags.add("katt");
		tags.add("kniv");

        builder = new SearchTagSuggestionsDBBuilder(tags, TagType.exercise_tag);

        String expectedQuery = "SELECT tag.name, tag.tag_id FROM tag, exercise_tag WHERE tag.tag_id = exercise_tag.tag_id GROUP BY tag.tag_id"+
							   " INTERSECT " +
							   "SELECT name, tag_id FROM tag WHERE tag.name NOT IN ('katt','kniv')";

        assertThat(builder
				.filterByTagType()
				.filterByExistingTags()
                .build().getQuery()).isEqualTo(expectedQuery);
    }
}


