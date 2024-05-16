package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.*;
import se.umu.cs.pvt.search.interfaces.responses.ExerciseSearchResponse;

import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a list of {@link ExerciseSearchResponse ExerciseSearchResponses}
 * based on the given list of {@link ExerciseDBResult ExerciseDBResults}.
 * 
 * @author Minotaur (James Eriksson)
 * 
 */
public class SearchExerciseResponseBuilder {
    private List<ExerciseDBResult> exerciseDBResultList;

    public SearchExerciseResponseBuilder(List<ExerciseDBResult> exerciseDBResultList){
        this.exerciseDBResultList = exerciseDBResultList;
    }

    /**
     * Builds a list of {@link ExerciseSearchResponse ExerciseSearchResponses}.
     *
     * @return The created list of ExerciseSearchResponses.
     */
    public List<ExerciseSearchResponse> build(){
        List<ExerciseSearchResponse> array = new ArrayList<>();
        exerciseDBResultList.forEach(result -> array.add(
                new ExerciseSearchResponse(
                        result.getId(), result.getName(), result.getDuration()
                )
        ));
        return array;
    }
}
