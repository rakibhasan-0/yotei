package se.umu.cs.pvt.search.interfaces;

/**
 * This class represents the Workout object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
 */
public class WorkoutSearchResponse implements SearchResponseInterface {
    private Long workoutID;
    private String name;
    private boolean favourite;

    public WorkoutSearchResponse(Long workoutID, String name, boolean favourite){
        this.workoutID = workoutID;
        this.name = name;
        this.favourite = favourite;
    }

    public String getName() {
        return name;
    }

    public Number getWorkoutID() {
        return workoutID;
    }

    public boolean getFavourite(){
        return favourite;
    }
}
