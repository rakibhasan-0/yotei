package se.umu.cs.pvt.workout.detail;

import se.umu.cs.pvt.user.User;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * Extension of the workout class to be able to join it to activities.
 * <p>
 * ActivityDetail.java - Activity detail class, maps exercises/techniques to workouts.
 * Workout.java - Base class that this class extends to provide a mapping
 * between workouts and activities.
 * WorkoutDetailRepository.java - JPARepository file.
 * WorkoutController.java - controller class where it is possible to get
 * WorkoutDetails from.
 *
 * @author Grupp 5 Cyclops
 */
@Entity
@Table(name = "workout")
public class WorkoutDetail {
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

    @ManyToOne
    @JoinColumn(name = "workout_author")
    private User author;

    @OneToMany(mappedBy = "workoutId")
    private List<ActivityDetail> activities;

    @ManyToMany(mappedBy = "workouts")
    private List<TagDetail> tags;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected WorkoutDetail() {
    }

    public WorkoutDetail(
            long id, String name, String desc, long duration,
            LocalDate created, LocalDate changed, Date date,
            boolean hidden, User author, List<ActivityDetail> activities,
            List<TagDetail> tags) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.duration = duration;
        this.created = created;
        this.changed = changed;
        this.date = date;
        this.hidden = hidden;
        this.author = author;
        this.activities = activities;
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

    public Long getDuration() {
        return duration;
    }

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

    public User getAuthor() {
        return author;
    }

    public List<ActivityDetail> getActivities() {
        return activities;
    }

    public List<TagDetail> getTags() {
        return tags;
    }
}
