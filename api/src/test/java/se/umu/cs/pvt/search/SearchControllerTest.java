package se.umu.cs.pvt.search;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.InstanceOfAssertFactories.COLLECTION;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import se.umu.cs.pvt.search.builders.SearchTechniquesDBBuilder;
import se.umu.cs.pvt.search.interfaces.ExerciseSearchResponse;
import se.umu.cs.pvt.search.interfaces.TechniqueSearchResponse;
import se.umu.cs.pvt.search.interfaces.WorkoutSearchResponse;
import se.umu.cs.pvt.search.persistance.SearchRepository;
import se.umu.cs.pvt.search.persistance.TagCompleteRepository;

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
    private TagCompleteRepository tagCompleteRepository;

    @Autowired
    private SearchController controller;

    @Test
    void search_techniques_should_return_ok() {
        DatabaseQuery query = new SearchTechniquesDBBuilder(new SearchTechniquesParams(new HashMap<>())).build();
        when(searchRepository.getTechniquesFromCustomQuery(query.getQuery())).thenReturn(List.of());
        when(tagCompleteRepository.completeTag("")).thenReturn(Optional.of(""));
        SearchController searchController = new SearchController(searchRepository, tagCompleteRepository);

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
}
