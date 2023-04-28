package se.umu.cs.pvt.search;

import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchTechniquesDBBuilder;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class TechniquesDBBuilderTest {

    SearchTechniquesParams params;
    SearchTechniquesDBBuilder builder;

    private String concatJoinBeltQuery(String query){
        return  "SELECT result.technique_id, result.name, b.belt_color FROM ( " +
                query + " " +
                ") AS result " +
                "JOIN technique_to_belt AS ttb ON ttb.technique_id=result.technique_id " +
                "JOIN belt AS b ON ttb.belt_id=b.belt_id";
    }

    @Test
    void isNotNull(){
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "name of technique");
        params = new SearchTechniquesParams(urlQuery);
        builder = new SearchTechniquesDBBuilder(params);
        assertThat(builder).isNotNull();
    }

    @Test
    void filterAllDefaultParams(){

        Map<String, String> urlQuery = new HashMap<>();

        params = new SearchTechniquesParams(urlQuery);
        builder = new SearchTechniquesDBBuilder(params);

        String baseQuery = "SELECT technique_id, name FROM technique";
        String expectedQuery = concatJoinBeltQuery(baseQuery);

        assertThat(builder
                .filterByTags()
                .filterByBelts()
                .filterByTechnique()
                .filterByKion()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

    @Test
    void filterByTwoTagsTest(){


        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of technique");
        urlQuery.put("tags", "tag1 tag2");

        params = new SearchTechniquesParams(urlQuery);
        builder = new SearchTechniquesDBBuilder(params);

        String baseQuery = "SELECT te.technique_id, te.name " +
                "FROM technique AS te, technique_tag AS tt, tag AS ta " +
                "WHERE tt.tech_id = te.technique_id AND tt.tag_id = ta.tag_id AND ta.name='tag1'" +
                " INTERSECT " +
                "SELECT te.technique_id, te.name " +
                "FROM technique AS te, technique_tag AS tt, tag AS ta " +
                "WHERE tt.tech_id = te.technique_id AND tt.tag_id = ta.tag_id AND ta.name='tag2'";

        String expectedQuery = concatJoinBeltQuery(baseQuery);

        assertThat(builder
                .filterByTags()
                .build().getQuery()).isEqualTo(expectedQuery);
    }



}
