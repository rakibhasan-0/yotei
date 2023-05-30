package se.umu.cs.pvt.search;

import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchUserDBBuilder;
import se.umu.cs.pvt.search.params.SearchUserParams;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Test class for SearchUserDBBuilder
 * 
 * @author Ludvig Larsson
 * @since 2023-05-16
 */
public class UserDBBuilderTest {
    SearchUserParams params;
    SearchUserDBBuilder builder;

    @Test
    void isNotNull() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "name of user");

        params = new SearchUserParams(urlQuery);
        builder = new SearchUserDBBuilder(params);
        assertThat(builder).isNotNull();
    }

    @Test
    void filterAllDefaultParams() {
        Map<String, String> urlQuery = new HashMap<>();

        params = new SearchUserParams(urlQuery);
        builder = new SearchUserDBBuilder(params);

        String expectedQuery = "SELECT u.user_id, u.username, u.user_role " +
                "FROM user_table AS u";

        assertThat(builder
                .filterById()
                .filterByRole()
                .build().getQuery()).isEqualTo(expectedQuery);
    }
}
