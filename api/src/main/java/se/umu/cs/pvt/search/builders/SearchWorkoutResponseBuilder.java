package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.WorkoutDBResult;
import se.umu.cs.pvt.search.interfaces.WorkoutSearchResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * This class builds a list of {@link WorkoutSearchResponse WorkoutSearchResponses}
 * based on the given list of {@link WorkoutDBResult WorkoutDBResults}.
 */
public class SearchWorkoutResponseBuilder {
    private List<WorkoutDBResult> workoutDBResultList;

    public SearchWorkoutResponseBuilder(List<WorkoutDBResult> workoutDBResultList){
        this.workoutDBResultList = workoutDBResultList;
    }

    /**
     * Builds a list of {@link WorkoutSearchResponse WorkoutSearchReponses}.
     *
     * @return The created list of WorkoutSearchResponses.
     */
    public List<WorkoutSearchResponse> build(){
        List<WorkoutSearchResponse> array = new ArrayList<>();
        workoutDBResultList.forEach(result -> array.add(
                new WorkoutSearchResponse(
                        result.getId(),
                        result.getName(),
                        result.getFavourite()
                )
        ));
        return array;
    }

}
