package se.umu.cs.pvt.search;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import se.umu.cs.pvt.search.builders.SearchTechniquesDBBuilder;
import se.umu.cs.pvt.search.interfaces.responses.ExerciseSearchResponse;
import se.umu.cs.pvt.search.interfaces.responses.TagSearchResponse;
import se.umu.cs.pvt.search.interfaces.responses.TechniqueSearchResponse;
import se.umu.cs.pvt.search.interfaces.responses.UserSearchResponse;
import se.umu.cs.pvt.search.interfaces.responses.WorkoutSearchResponse;
import se.umu.cs.pvt.search.params.SearchTechniquesParams;
import se.umu.cs.pvt.search.persistance.SearchRepository;
import se.umu.cs.pvt.search.responses.SearchResponse;
import se.umu.cs.pvt.search.responses.TagResponse;
import se.umu.cs.pvt.user.JWTUtil;
import se.umu.cs.pvt.workout.UserShortRepository;

/**
 * Test class for SearchController endpoint
 *
 * @author Kraken & Minotaur
 * date: 2023-05-03
 */
@WebMvcTest(controllers = SearchController.class)
@ExtendWith(MockitoExtension.class)
public class SearchControllerTest {

    @MockBean
    private SearchRepository searchRepository;

    @MockBean
    private UserShortRepository userShortRepository;

    @MockBean
    private JWTUtil jwtUtil;

    @Autowired
    private SearchController controller;

    @Test
    void search_techniques_should_return_ok() {
        DatabaseQuery query = new SearchTechniquesDBBuilder(new SearchTechniquesParams(new HashMap<>())).build();
        when(searchRepository.getTechniquesFromCustomQuery(query.getQuery())).thenReturn(List.of());
        SearchController searchController = new SearchController(searchRepository, userShortRepository);

        ResponseEntity<SearchResponse<TechniqueSearchResponse>> response = searchController.searchTechniques(new HashMap<>());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void search_workouts_should_return_ok() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "döda ful");
        urlQuery.put("tag", "katt");

        ResponseEntity<SearchResponse<WorkoutSearchResponse>> response = controller.searchWorkouts(urlQuery);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void search_exercises_should_return_ok() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "döda ful");
        urlQuery.put("tag", "katt");

        ResponseEntity<SearchResponse<ExerciseSearchResponse>> response = controller.searchExercises(urlQuery);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

	@Test
    void search_tag_should_return_ok() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "tag");
        urlQuery.put("tagAmount", "5");
		urlQuery.put("tags", "katt");

        ResponseEntity<TagResponse<TagSearchResponse>> response = controller.searchTags(urlQuery);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void search_user_should_return_ok() {
        Map<String, String> urlQuery = new HashMap<>();
        urlQuery.put("name", "user");

        ResponseEntity<SearchResponse<UserSearchResponse>> response = controller.searchUsers(urlQuery);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
