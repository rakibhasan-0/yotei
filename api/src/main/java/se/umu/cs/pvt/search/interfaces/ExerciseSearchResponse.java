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
    private Long duration;
    public ExerciseSearchResponse(Long id, String name, Long duration){
        this.id = id;
        this.name = name;
        this.duration = duration;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getDuration() {
        return duration;
    }
}
