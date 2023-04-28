package se.umu.cs.pvt.search.interfaces;

/**
 * This class represents the Exercise object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
 */
public class ExerciseSearchResponse implements SearchResponseInterface {
    private Long id;
    private String name;

    public ExerciseSearchResponse(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
