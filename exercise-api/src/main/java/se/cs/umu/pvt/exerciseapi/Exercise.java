package se.cs.umu.pvt.exerciseapi;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Model for exercise data in database
 *
 * @author Quattro Formaggio, Carlskrove
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

    /**
     * Gets id
     * @return id
     */
    public Long getId() {
        return id;
    }

    /**
     * Gets name
     * @return name
     */
    public String getName() {
        return name;
    }

    /**
     * Gets desc
     * @return desc
     */
    public String getDescription() {
        return description;
    }

    /**
     * Gets duration
     * @return duration
     */
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