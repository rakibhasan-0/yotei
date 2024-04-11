package se.umu.cs.pvt.search.interfaces.responses;

/**
 * This class represents the Workout object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
 * @author Chimera (Alexander Arvidsson Örnberg)
 */
public class WorkoutSearchResponse implements SearchResponseInterface {
    private Long workoutID;
    private String name;
    private boolean favourite;
    private int author;

    public WorkoutSearchResponse(Long workoutID, String name, boolean favourite, int author){
        this.workoutID = workoutID;
        this.name = name;
        this.favourite = favourite;
        this.author = author;
    }

    public String getName() {
        return name;
    }

    public Number getWorkoutID() {
        return workoutID;
    }

    public boolean getFavourite() {
        return favourite;
    }

    public int getAuthor() {
        return author;
    }
}
