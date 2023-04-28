package se.umu.cs.pvt.search.interfaces;

/**
 * This class represents the Workout object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
 */
public class WorkoutSearchResponse implements SearchResponseInterface {
    private Long id;
    private String name;

    public WorkoutSearchResponse(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public Number getId() {
        return id;
    }
}
