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
 * @author Chimera (Alexander Arvidsson Örnberg)
 */

@Entity
public class WorkoutDBResult implements Serializable {

    @Id
    @Column(nullable = false, name = "workout_id")
    private Long workoutId;

    @Column(nullable = false, name = "workout_name")
    private String name;

    @Column(nullable = false, name = "favourite")
    private boolean favourite;

    @Column(nullable = false, name = "workout_author")
    private int author;

    protected WorkoutDBResult() {}

    public WorkoutDBResult(Long workoutId, String name, int author, boolean favourite) {
        this.workoutId = workoutId;
        this.name = name;
        this.author = author;
        this.favourite = favourite;
    }

    public Long getId() {
        return workoutId;
    }

    public String getName() {
        return name;
    }

    public boolean getFavourite(){
        return favourite;
    }

    public int getAuthor() {
        return author;
    }
}
