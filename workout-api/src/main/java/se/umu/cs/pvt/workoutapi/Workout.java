package se.umu.cs.pvt.workoutapi;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * Model for workout data in database
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

    /**
     * Constructor for workout
     * @param id id of workout
     * @param name name of workout
     * @param desc desc of workout
     * @param duration duration of workout
     * @param created date created
     * @param date date
     * @param hidden hidden
     * @param author foreign key to user
     */
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

    /**
     * @return the description
     */
    public String getDesc() {
        return desc;
    }

    /**
     * @return the duration
     */
    public Long getDuration() { return duration; }

    /**
     * @return the created date
     */
    public LocalDate getCreated() {
        return created;
    }

    /**
     * @return the changed date
     */
    public LocalDate getChanged() {
        return changed;
    }

    /**
     * @return the date
     */
    public Date getDate() {
        return date;
    }

    /**
     * @return the hidden
     */
    public Boolean getHidden() {
        return hidden;
    }

    /**
     * @return the author
     */
    public Long getAuthor() {
        return author;
    }
}