package se.umu.cs.pvt.workout;

import javax.persistence.*;

/**
 * Model for activity data in database
 *
 * @author Grupp 8 Kebabpizza
 */
@Entity
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "activity_id")
    private Long id;

    @Column(nullable = false, name = "workout_id")
    private Long workoutId;

    @Column(name = "exercise_id")
    private Long exerciseId;

    @Column(name = "technique_id")
    private Long techniqueId;

    @Column(nullable = false, name = "activity_name")
    private String name;

    @Column(name = "activity_desc")
    private String desc;

    @Column(nullable = false, name = "activity_duration")
    private int duration;

    @Column(nullable = false, name = "activity_order")
    private int order;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Activity() {}

    /**
     * Constructor for activity
     * @param id id of activity
     * @param name name of activity
     * @param desc desc of activity
     * @param duration duration of activity
     * @param order order of activity
     */
    public Activity(Long id, String name, String desc, int duration, int order) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.duration = duration;
        this.order = order;
    }

    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @return the workout id
     */
    public Long getWorkoutId() {
        return workoutId;
    }

    /**
     * @return the exercise id
     */
    public Long getExerciseId() {
        return exerciseId;
    }

    /**
     * @return the technique id
     */
    public Long getTechniqueId() {
        return techniqueId;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @return the desc
     */
    public String getDesc() {
        return desc;
    }

    /**
     * @return the duration
     */
    public int getDuration() {
        return duration;
    }

    /**
     * @return the order
     */
    public int getOrder() {
        return order;
    }

    /**
     *
     * @param workoutId workout id to reference
     */
    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }
}
