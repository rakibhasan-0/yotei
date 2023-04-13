/**
 * The repo used for UserWorkout
 * @author Grupp 2 Capricciosa
 */

package se.umu.cs.pvt.workoutapi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;

/**
 * JPARepository for UserWorkout
 *
 * @author Grupp 2 Cappriciosa
 */

@Repository
public interface UserWorkoutRepository extends JpaRepository<UserWorkout, Long> {

    /**
     * Finds workoutUser pair
     * @param userId
     * @param workoutId
     * @return The userWorkout if it's found
     */
    UserWorkout findByWorkoutIdAndUserId(Long workoutId, Long userId);

    /**
     * Deletes UserWorkout with specified workout- and user id
     * @param workoutId
     * @param userId
     */
    void deleteByWorkoutIdAndUserId(Long workoutId, Long userId);

}
