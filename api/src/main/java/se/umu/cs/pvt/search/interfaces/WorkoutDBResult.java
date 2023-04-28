package se.umu.cs.pvt.search.interfaces;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * This entity represents the object returned
 * from the query sent to the database when
 * searching for workouts.
 *
 * @author Minotaur (James Eriksson)
 */

@Entity
public class WorkoutDBResult implements Serializable, SearchResponseInterface {

    @Id
    @Column(nullable = false, name = "workout_id")
    private Long id;

    @Column(nullable = false, name = "workout_name")
    private String name;

    protected WorkoutDBResult() {}

    public WorkoutDBResult(Long id, String name) {
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
