package se.umu.cs.pvt.workout.detail;

import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.technique.Technique;

import javax.persistence.*;

/**
 * Extension of the activity class to be able to join it to techniques and exercises.
 * <p>
 * ActivityDetail.java - Activity detail class, maps exercises/techniques to workouts.
 * Technique.java - technique class.
 * Exercise.java - Exercise class
 * WorkoutDetailRepository.java - JPARepository file.
 * WorkoutController.java - controller class where it is possible to get
 * WorkoutDetails from.
 *
 * @author Grupp 5 Cyclops
 */
@Entity
@Table(name = "activity")
public class ActivityDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "activity_id")
    private Long id;

    @Column(nullable = false, name = "workout_id")
    private Long workoutId;

    @Column(name = "category_name")
    private String categoryName;

    @Column(nullable = false, name = "category_order")
    private int categoryOrder;

    @Column(nullable = false, name = "activity_name")
    private String name;

    @Column(name = "activity_desc")
    private String desc;

    @Column(nullable = false, name = "activity_duration")
    private int duration;

    @Column(nullable = false, name = "activity_order")
    private int order;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "workout_id", insertable = false, updatable = false)
    private WorkoutDetail workout;

    @ManyToOne
    @JoinColumn(name = "technique_id", insertable = false, updatable = false)
    private Technique technique;

    @ManyToOne
    @JoinColumn(name = "exercise_id", insertable = false, updatable = false)
    private Exercise exercise;

    protected ActivityDetail() {
    }

    public ActivityDetail(
            long id, long workoutId, String categoryName,
            int categoryOrder, String name, String desc,
            int order, int duration, Technique technique, Exercise exercise) {
        this.id = id;
        this.workoutId = workoutId;
        this.categoryName = categoryName;
        this.categoryOrder = categoryOrder;
        this.name = name;
        this.desc = desc;
        this.order = order;
        this.duration = duration;
        this.technique = technique;
        this.exercise = exercise;
    }

    public Long getId() {
        return id;
    }

    public Long getWorkoutId() {
        return workoutId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public int getCategoryOrder() {
        return categoryOrder;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }

    public int getOrder() {
        return order;
    }

    public int getDuration() {
        return duration;
    }

    public Technique getTechnique() {
        return technique;
    }

    public Exercise getExercise() {
        return exercise;
    }
}
