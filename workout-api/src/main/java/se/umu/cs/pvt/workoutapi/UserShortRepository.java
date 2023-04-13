package se.umu.cs.pvt.workoutapi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The repo used for UserShorts.
 * @author Grupp 2 Capricciosa
 */

@Repository
public interface UserShortRepository extends JpaRepository<UserShort, Long> {

    /**
     * Fetches users for a specific workout.
     * @param workoutId id of workout.
     * @return List of users with id and name.
     */
    @Query("SELECT us FROM UserShort as us, UserWorkout as uw where  us.user_id = uw.userId and uw.workoutId = :workoutId")
    List<UserShort> findNamesByWorkoutId(Long workoutId);

}
