package se.umu.cs.pvt.search;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.search.builders.*;
import se.umu.cs.pvt.search.interfaces.*;
import se.umu.cs.pvt.search.persistance.SearchRepository;
import se.umu.cs.pvt.search.persistance.TagCompleteRepository;

import java.util.*;

/**
 * Controller for making searching to Techniques, Exercises and Workouts.
 *
 * @author Minotaur (James Eriksson`)
 * @author Kraken (Christoffer Nordlander)
 * @author Kraken (Jonas Gustavsson)
 */

@RestController
@CrossOrigin
@RequestMapping(path = "/api/search")
public class SearchController {

    private final SearchRepository searchRepository;
    private final TagCompleteRepository tagCompleteRepository;

    private Logger LOG = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    public SearchController(SearchRepository searchRepository, TagCompleteRepository tagCompleteRepository){
        this.searchRepository = searchRepository;
        this.tagCompleteRepository = tagCompleteRepository;
    }

    /**
     * API endpoint for getting the initial 15 most used techniques when
     * technique page is first loaded. Sends OK http status if techniques
     * are found, otherwise sends NOT_FOUND status.
     *
     * @return The 15 most used techniques.
     */
    @GetMapping("/techniques/init")
    public ResponseEntity<SearchResponse<TechniqueDBResult>> getInitialTechniques() {
        List<TechniqueDBResult> result = searchRepository.getTechniquesFromCustomQuery(
                "SELECT t.technique_id, t.name FROM technique as t, activity as a " +
                        "WHERE t.technique_id = a.technique_id GROUP BY t.technique_id " +
                        "ORDER BY COUNT(a.technique_id) DESC LIMIT 15;");

        if(result.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        SearchResponse<TechniqueDBResult> response = new SearchResponse<>(result, Optional.empty());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * API endpoint for making search requests to Techniques.
     * It filters the techniques based on the given query.
     *
     * Example query:
     * /api/search/techniques?name=test&tags=tag1,tag2&beltColors=1,2,3&technique=false&kion=true
     *
     * Not that the query can be empty, or contain any or all of the entries.
     *
     * @param urlQuery The query passed with the request.
     * @return A SearchResponseInterface.
     */
    @GetMapping("/techniques")
    public ResponseEntity<SearchResponse<TechniqueSearchResponse>> searchTechniques(@RequestParam Map<String, String> urlQuery) {
        SearchTechniquesParams searchTechniquesParams = new SearchTechniquesParams(urlQuery);

        DatabaseQuery createdQuery = new SearchTechniquesDBBuilder(searchTechniquesParams)
                .filterByBelts()
                .filterByTags()
                .filterByTechnique()
                .filterByKion()
                .build();

        List<TechniqueDBResult> results = searchRepository.getTechniquesFromCustomQuery(createdQuery.getQuery());
        List<TechniqueSearchResponse> techniqueSearchResponses = new SearchTechniqueResponseBuilder(results).build();
        List<TechniqueSearchResponse> filteredResult = fuzzySearchFiltering(searchTechniquesParams.getName(), techniqueSearchResponses);

        List<String> tags = searchTechniquesParams.getTags();
        Optional<String> tagCompletion = Optional.empty();
        if (tags != null) {
            String lastTag = tags.get(tags.size() - 1);
            tagCompletion = tagCompleteRepository.completeTag(lastTag);
        }

        SearchResponse<TechniqueSearchResponse> response = new SearchResponse<>(filteredResult, tagCompletion);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * API endpoint for making search requests to Workouts.
     * It filters the workouts based on the given query.
     *
     * Example query:
     * /api/search/workouts?name=test&date=2020-05-02
     *
     * Not that the query can be empty, or contain any or all of the entries.
     *
     * @param urlQuery The query passed with the request.
     * @return A SearchResponseInterface.
     */
    @GetMapping("/workouts")
    public ResponseEntity<SearchResponse<WorkoutSearchResponse>> searchWorkouts(@RequestParam Map<String, String> urlQuery) {
        SearchWorkoutParams searchWorkoutParams = new SearchWorkoutParams(urlQuery);

        DatabaseQuery createdQuery = new SearchWorkoutDBBuilder(searchWorkoutParams)
                .filterByDate()
                .build();

        List<WorkoutDBResult> result = searchRepository.getWorkoutsFromCustomQuery(createdQuery.getQuery());
        List<WorkoutSearchResponse> workoutSearchResponses = new SearchWorkoutResponseBuilder(result).build();
        List<WorkoutSearchResponse> filteredResult = fuzzySearchFiltering(searchWorkoutParams.getName(), workoutSearchResponses);


        SearchResponse<WorkoutSearchResponse> response = new SearchResponse<>(filteredResult, Optional.empty());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * API endpoint for making search requests to Exercises.
     * It filters the exercises based on the given query.
     *
     * Example query:
     * /api/search/exercises?name=test&tags=tag1,tag2
     *
     * Not that the query can be empty, or contain any or all of the entries.
     *
     * @param urlQuery The query passed with the request.
     * @return A SearchResponseInterface.
     */
    @GetMapping("/exercises")
    public ResponseEntity<SearchResponse<ExerciseSearchResponse>> searchExercises(@RequestParam Map<String, String> urlQuery) {
        SearchExerciseParams searchExerciseParams = new SearchExerciseParams(urlQuery);

        DatabaseQuery createdQuery = new SearchExerciseDBBuilder(searchExerciseParams)
                .filterByTags()
                .build();

        List<ExerciseDBResult> result = searchRepository.getExercisesFromCustomQuery(createdQuery.getQuery());
        List<ExerciseSearchResponse> exerciseSearchResponses = new SearchExerciseResponseBuilder(result).build();
        List<ExerciseSearchResponse> filteredResult = fuzzySearchFiltering(searchExerciseParams.getName(), exerciseSearchResponses);

        SearchResponse<ExerciseSearchResponse> response = new SearchResponse(filteredResult, Optional.empty());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     *
     * @param str The string being used to search the list with.
     * @param response The list of responses being filtered.
     * @param <T> The type of SearchResponse being filtered.
     * @return The list of the filtered SearchResponse.
     */
    private <T extends SearchResponseInterface> List<T> fuzzySearchFiltering(String str, List<T> response) {
        return Fuzzy.search(str, response);
    }
}
