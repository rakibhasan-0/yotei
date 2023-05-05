package se.umu.cs.pvt.search;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.search.builders.*;
import se.umu.cs.pvt.search.enums.TagType;
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
 * @author Kraken (Oskar Westerlund Holmgren)
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
    public ResponseEntity<SearchResponse<TechniqueSearchResponse>> getInitialTechniques() {
        List<TechniqueDBResult> result = searchRepository.getTechniquesFromCustomQuery(
                "SELECT t.technique_id, t.name FROM technique as t, activity as a " +
                        "WHERE t.technique_id = a.technique_id GROUP BY t.technique_id " +
                        "ORDER BY COUNT(a.technique_id) DESC LIMIT 15;");

        if(result.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        SearchResponse<TechniqueSearchResponse> response = new SearchResponse(result, new ArrayList<>());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * API endpoint for making search requests to Techniques.
     * It filters the techniques based on the given query.
     *
     * Example query:
     * (GET) /api/search/techniques?name=lm+ao&beltColors=grön,grön-barn&kihon=false&tags=kniv,spark
     *
     * Note that the query can be empty, or contain any or all of the entries.
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
                .filterByKihon()
                .build();

        List<TechniqueDBResult> results = searchRepository.getTechniquesFromCustomQuery(createdQuery.getQuery());
        List<TechniqueSearchResponse> techniqueSearchResponses = new SearchTechniqueResponseBuilder(results).build();
        List<TechniqueSearchResponse> filteredResult = fuzzySearchFiltering(searchTechniquesParams.getName(), techniqueSearchResponses);

		// Get tag complete suggestion from search input
        List<String> tagCompletion = getTagSuggestions(searchTechniquesParams.getName(), searchTechniquesParams.getTags(), TagType.technique_tag);

        SearchResponse<TechniqueSearchResponse> response = new SearchResponse<>(filteredResult, tagCompletion);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * API endpoint for making search requests to Workouts.
     * It filters the workouts based on the given query.
     *
     * Example query:
     * (GET) /api/search/workouts?name=lmao&from=2023-04-20&to=2023-04-20&favourite=false&tags=kniv,spark&id=1
     *
     * Note that the query can be empty, or contain any or all of the entries.
     *
     * @param urlQuery The query passed with the request.
     * @return A SearchResponseInterface.
     */
    @GetMapping("/workouts")
    public ResponseEntity<SearchResponse<WorkoutSearchResponse>> searchWorkouts(@RequestParam Map<String, String> urlQuery) {
        SearchWorkoutParams searchWorkoutParams = new SearchWorkoutParams(urlQuery);

        DatabaseQuery createdQuery = new SearchWorkoutDBBuilder(searchWorkoutParams)
                .filterByDate()
                .filterByFavourite()
                .filterByUserId()
                .filterByTags()
                .build();

        List<WorkoutDBResult> result = searchRepository.getWorkoutsFromCustomQuery(createdQuery.getQuery());
        List<WorkoutSearchResponse> workoutSearchResponses = new SearchWorkoutResponseBuilder(result).build();
        List<WorkoutSearchResponse> filteredResult = fuzzySearchFiltering(searchWorkoutParams.getName(), workoutSearchResponses);

		// Get tag complete suggestion from search input
        List<String> tagCompletion = getTagSuggestions(searchWorkoutParams.getName(), searchWorkoutParams.getTags(), TagType.workout_tag);

        SearchResponse<WorkoutSearchResponse> response = new SearchResponse<>(filteredResult, tagCompletion);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * API endpoint for making search requests to Exercises.
     * It filters the exercises based on the given query.
     *
     * Example query:
     * (GET) /api/search/exercises?name=something+something&tags=kniv,spark
     *
     * Note that the query can be empty, or contain any or all of the entries.
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

		// Get tag complete suggestion from search input
        List<String> tagCompletion = getTagSuggestions(searchExerciseParams.getName(), searchExerciseParams.getTags(), TagType.exercise_tag);

        SearchResponse<ExerciseSearchResponse> response = new SearchResponse(filteredResult, tagCompletion);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    /**
     * API endpoint for getting suggestions for tags.
     * It filters the tags based on the given query.
     *
     * Example query:
     * /api/search/tags?name=test&tags=tag1,tag2&tagAmount=5
     *
     * Note that the query can be empty, or contain any or all of the entries.
     *
     * @param urlQuery The query passed with the request.
     * @return A SearchResponseInterface.
     */
    @GetMapping("/tags")
    public ResponseEntity<TagResponse<TagSearchResponse>> searchTags(@RequestParam Map<String, String> urlQuery) {
        SearchTagsParams searchTagsParams = new SearchTagsParams(urlQuery);

        DatabaseQuery createdQuery = new SearchTagsDBBuilder(searchTagsParams)
                .filterByTags()
                .build();

        List<TagDBResult> result = searchRepository.getTagSuggestionsFromCustomQuery(createdQuery.getQuery());
        List<TagSearchResponse> tagSearchResponses = new SearchTagsResponseBuilder(result).build();
        List<TagSearchResponse> filteredResult = fuzzySearchFiltering(searchTagsParams.getName(), tagSearchResponses);

        List<TagSearchResponse> finalResult = new ArrayList<>();
        for (int i = 0; i < searchTagsParams.getAmount() && i < filteredResult.size(); i++) {
            finalResult.add(filteredResult.get(i));
        }

        TagResponse<TagSearchResponse> response = new TagResponse(finalResult);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    /**
     * API endpoint for making search requests to Plans.
     * It filters the plans based on the given query.
     *
     * Not that the query can be empty, or contain any or all of the entries.
     *
     * @param urlQuery The query passed with the request.
     * @return A SearchResponseInterface.
     */
    @GetMapping("/plans")
    public ResponseEntity<SearchResponse<PlanSearchResponse>> searchPlans(@RequestParam Map<String, String> urlQuery) {
        SearchPlanParams searchPlanParams = new SearchPlanParams(urlQuery);

        DatabaseQuery createdQuery = new SearchPlanDBBuilder(searchPlanParams)
                .filterByPlans()
                .filterById()
                .build();

        List<PlanDBResult> result = searchRepository.getPlansFromCustomQuery(createdQuery.getQuery());
        List<PlanSearchResponse> planSearchResponses = new SearchPlanResponseBuilder(result).build();

        SearchResponse<PlanSearchResponse> response = new SearchResponse(planSearchResponses, new ArrayList<>());
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

	/**
	 * Gets best tag suggstions based on search.
	 * @param searchInput Search string.
	 * @param tags Already chossen tags, will be omitted in the suggestion.
	 * @param tagType Type of tag, workout technique eg.
	 * @return List of suggested tags.
	 */
	private List<String> getTagSuggestions(String searchInput, List<String> tags, TagType tagType) {
		// Take out list of tags to check against
		DatabaseQuery createdQuery = new SearchTagSuggestionsDBBuilder(tags, tagType)
                .filterByTagType()
				.filterByExistingTags()
                .build();

        List<TagDBResult> tagResult = searchRepository.getTagSuggestionsFromCustomQuery(createdQuery.getQuery());
        List<TagDBResult> filteredResult = Fuzzy.search(searchInput, tagResult);

		// Take out first three results.
		List<String> tagCompletion = new ArrayList<String>();
		int tagAmount = 3;
		// Check if tag suggestion list is less that desired tag amount.
		// If thats the case reduce size of desired tag a
		if(filteredResult.size() < tagAmount) {
			tagAmount = filteredResult.size();
		}
		for(int i = 0; i < tagAmount; i++) {
			tagCompletion.add(filteredResult.get(i).getName());
		}

		return tagCompletion;
	}
}
