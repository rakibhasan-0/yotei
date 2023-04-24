package se.umu.cs.pvt.workout;


import javax.persistence.*;
import java.io.Serializable;

/**
 * Model for UserwWorkout data in database
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

    /**
     * Creates a UserWorkout.
     * @param userId id of the user.

    public UserWorkout(Long userId) {
        this.userId = userId;
    }
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }

    /**
     * @return user id.
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * @return Id of the workout.
     */
    public Long getWorkoutId() {
        return workoutId;
    }

}
