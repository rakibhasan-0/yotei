package se.umu.cs.pvt.exercise;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Model for exercise data in database
 * 
 * Exercise.java - The exercise class
 * ExerciseController.java - Class that gets, inserts, updates and removes exercise.
 * ExerciseDropDownProjection.java - JPA-entity projection for dropdown information activities.
 * ExerciseImportResponse.java - Class made to make the response on import easier.
 * ExerciseRepository.java - (Interface) JPARepository for exercises.
 * ExerciseShort.java - (Interface) Projection for Id, Name and Duration of exercises.
 *
 * @author Quattro Formaggio, Carlskrove (Doc: Griffin c19hln)
 */
@Entity
@Table(name = "exercise")
public class Exercise implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "exercise_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(nullable = false, name = "duration")
    private int duration;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Exercise() {
        // no-args constructor required by JPA spec
        // this one is protected since it shouldn't be used directly
    }

    /**
     * Creates a exercise
     * @param id id of exercise
     * @param name name of exercise
     * @param description of exercise
     * @param duration of exercise
     */
    public Exercise(Long id, String name, String description, int duration) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.duration = duration;
    }

    
    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }

    
    public String getDescription() {
        return description;
    }

    
    public int getDuration() {
        return duration;
    }


    /**
     * Tells if a exercise has valid format.
     * @return true if exercise is valid, else false.
     */
    public boolean validFormat() {
        if (getDuration() < 0) {
            return false;
        }

        if (getName() == null || getName().length() == 0) {
            return false;
        }

        return true;
    }

    /**
     * Remove leading and trailing whitespaces.
     */
    public void trimText() {
        if (this.name != null) {
            this.name = name.trim();
        }

        if (this.description != null) {
            this.description = description.trim();
        }
    }
}