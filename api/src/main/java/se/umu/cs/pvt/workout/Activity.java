package se.umu.cs.pvt.workout;

import javax.persistence.*;

/**
 * Model for activity data in database
 *
 * Documentation Griffin ens19amd
 * JPA (Java Persistence API)
 *
 *  Activity.java - Activity class. Represents the Plan Entity.
 *  ActivityController.java - Activity API for creating, reading, updating and deleting plans.
 *  ActivityRepository.java (Interface) - JPARepository file.
 * 
 *  UserShort.java - Represents a minimal data structure for user table.
 *  UserShortRepository.java (Interface) - JPARepository file.
 * 
 * @author Grupp 8 Kebabpizza
 * @author Grupp 5 Cyclops
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

    @Column(name = "category_name")
    private String categoryName;

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

    public Long getId() {
        return id;
    }

    public Long getWorkoutId() {
        return workoutId;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public Long getTechniqueId() {
        return techniqueId;
    }

    public String getCategoryName() { return categoryName; }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }

    public int getDuration() {
        return duration;
    }

    public int getOrder() {
        return order;
    }
    
    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }
}
