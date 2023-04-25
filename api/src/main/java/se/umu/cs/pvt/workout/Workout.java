package se.umu.cs.pvt.workout;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

/**
 * Model for workout data in database
 * 
 *  Documentation Griffin ens19amd
 *  JPA (Java Persistence API)
 * 
 *  Workout.java - Workout class. Represents the Workout Entity.
 *  WorkoutController.java - Workout API for creating, reading, updating and deleting workouts.
 *  WorkoutDropDownProjection.java - JPA-entity projection for dropdown information Workouts.
 *  WorkoutRepository.java (Interface) - JPARepository file.
 *  WorkoutShort.java - Represents a minimal data structure for workout.
 *
 * @author Grupp 8 Kebabpizza
 */
@Entity
@Table(name = "workout")
public class Workout implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "workout_id")
    private Long id;

    @Column(nullable = false, name = "workout_name")
    private String name;

    @Column(nullable = false, name = "workout_desc")
    private String desc;

    @Column(nullable = false, name = "workout_duration")
    private Long duration;

    @Column(nullable = false, name = "workout_created")
    private LocalDate created;

    @Column(nullable = false, name = "workout_changed")
    private LocalDate changed;

    @Column(nullable = false, name = "workout_date")
    private Date date;

    @Column(nullable = false, name = "workout_hidden")
    private Boolean hidden;

    @Column(nullable = false, name = "workout_author")
    private Long author;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Workout() {}

    public Workout(Long id, String name, String desc, Long duration, LocalDate created, LocalDate edited,
                    Date date, boolean hidden, Long author) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.duration = duration;
        this.created = created;
        this.changed = changed;
        this.date = date;
        this.hidden = hidden;
        this.author = author;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }

    public Long getDuration() { return duration; }

    public LocalDate getCreated() {
        return created;
    }

    public LocalDate getChanged() {
        return changed;
    }

    public Date getDate() {
        return date;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public Long getAuthor() {
        return author;
    }
}