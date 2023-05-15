package se.umu.cs.pvt.search;

import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchTechniquesDBBuilder;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Test class for SearchTechniquesDBBuilder
 *
 * @author Jonas Gustavsson (Kraken)
 * @author James Eriksson (Minotaur)
 * date: 2023-05-15 (Oskar's birthday)
 */
public class TechniquesDBBuilderTest {

    SearchTechniquesParams params;
    SearchTechniquesDBBuilder builder;

    private String concatJoinBeltQuery(String query){
        return  "SELECT result.technique_id, result.name, b.belt_name, b.belt_color, b.is_child FROM ( " +
                query + " " +
                ") AS result " +
                "LEFT JOIN technique_to_belt AS ttb ON ttb.technique_id=result.technique_id " +
                "LEFT JOIN belt AS b ON ttb.belt_id=b.belt_id";
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
                .filterByKihon()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

    @Test
    void filterByTwoTagsTest(){


        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of technique");
        urlQuery.put("tags", "tag1,tag2");

        params = new SearchTechniquesParams(urlQuery);
        builder = new SearchTechniquesDBBuilder(params);

        String baseQuery = "SELECT te.technique_id, te.name " +
                "FROM technique AS te, technique_tag AS tt, tag AS ta " +
                "WHERE tt.tech_id = te.technique_id AND tt.tag_id=ta.tag_id AND LOWER(ta.name)=LOWER('tag1')" +
                " INTERSECT " +
                "SELECT te.technique_id, te.name " +
                "FROM technique AS te, technique_tag AS tt, tag AS ta " +
                "WHERE tt.tech_id = te.technique_id AND tt.tag_id=ta.tag_id AND LOWER(ta.name)=LOWER('tag2')";

        String expectedQuery = concatJoinBeltQuery(baseQuery);

        assertThat(builder
                .filterByTags()
                .build().getQuery()).isEqualTo(expectedQuery);
    }

    @Test
    void filterByTwoBeltsTest(){


        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name","name of technique");
        urlQuery.put("beltColors", "gul,Svart");

        params = new SearchTechniquesParams(urlQuery);
        builder = new SearchTechniquesDBBuilder(params);

        String baseQuery = "SELECT te.technique_id, te.name " +
                "FROM technique AS te, belt AS b, technique_to_belt AS ttb " +
                "WHERE te.technique_id=ttb.technique_id AND b.belt_id=ttb.belt_id AND " +
                "LOWER(b.belt_name)=LOWER('gul') AND b.is_child=false" +
                " UNION " +
                "SELECT te.technique_id, te.name " +
                "FROM technique AS te, belt AS b, technique_to_belt AS ttb " +
                "WHERE te.technique_id=ttb.technique_id AND b.belt_id=ttb.belt_id AND " +
                "LOWER(b.belt_name)=LOWER('Svart') AND b.is_child=false";

        String expectedQuery = concatJoinBeltQuery(baseQuery);

        assertThat(builder
                .filterByBelts()
                .build().getQuery()).isEqualTo(expectedQuery);
    }



}
