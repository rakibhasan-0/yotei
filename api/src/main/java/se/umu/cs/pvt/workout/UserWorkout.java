package se.umu.cs.pvt.workout;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Model for UserwWorkout data in database
 * 
 *  Documentation Griffin ens19amd
 *  JPA (Java Persistence API)
 * 
 *  UserWorkout.java - UserWorkout class. Represents the UserWorkout Entity.
 *  UserWorkoutController.java - UserWorkout API for creating, reading and deleting plans.
 *  UserWorkoutRepository.java (Interface) - JPARepository file.
 *
 * @author Grupp 2 Cappriciosa
 */
@Entity
@Table(name = "user_workout")
public class UserWorkout implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "uw_id")
    private Long uwId;

    @Column(nullable = false, name = "user_id")
    private Long userId;

    @Column(nullable = false, name = "workout_id")
    private Long workoutId;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected UserWorkout() {}

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getWorkoutId() {
        return workoutId;
    }

}
