package se.umu.cs.pvt.search.interfaces;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * This entity represents the object returned
 * from the query sent to the database when
 * searching for exercises.
 *
 * @author Minotaur (James Eriksson)
 */

@Entity
public class ExerciseDBResult implements Serializable {

    @Id
    @Column(nullable = false, name = "exercise_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExerciseDBResult() {}

    /**
     * Constructor for workout
     * @param id id of workout
     * @param name name of workout
     */
    public ExerciseDBResult(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }
}
