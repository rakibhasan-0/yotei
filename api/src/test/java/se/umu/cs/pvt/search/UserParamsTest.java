package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for SearchUserParams
 * 
 * @author Ludvig Larsson
 * @since 2023-05-16
 */
public class UserParamsTest {
    SearchUserParams params;

    @BeforeEach
    void init() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "name of user");
        urlQuery.put("role", "admin");
        urlQuery.put("id", "1");

        params = new SearchUserParams(urlQuery);
    }

    @Test
    void isNotNull() {
        assertThat(params).isNotNull();
    }
    
    @Test
    void hasNameTestShouldBeTrue() {
        assertThat(params.hasName()).isTrue();
    }
    
    @Test
    void hasNameTestShouldBeFalse() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("role", "admin");
        
        params = new SearchUserParams(urlQuery);
        assertThat(params.hasName()).isFalse();
    }

    @Test
    void getNameTest() {
        assertThat(params.getName()).isEqualTo("name of user");
    }

    @Test
    void hasRoleTestShouldBeTrue() {
        assertThat(params.hasRole()).isTrue();
    }

    @Test
    void hasRoleTestShouldBeFalse() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "name of user");

        params = new SearchUserParams(urlQuery);
        assertThat(params.hasRole()).isFalse();
    }

    @Test
    void getRoleTest() {
        assertThat(params.getRole()).isEqualTo("0");
    }

    @Test
    void hasIdTestShouldBeTrue() {
        assertThat(params.hasId()).isTrue();
    }

    @Test
    void hasIdTestShouldBeFalse() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "name of user");

        params = new SearchUserParams(urlQuery);
        assertThat(params.hasId()).isFalse();
    }

    @Test
    void getIdTest() {
        assertThat(params.getId()).isEqualTo("1");
    }
}
