package se.umu.cs.pvt.workout;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

/**
 *  UserWorkout API for creating, reading and deleting plans.
 *
 *  @author Unknown (Doc: Griffin ens19amd)
 */

@RestController
@CrossOrigin
@RequestMapping("/api/workouts")
public class UserWorkoutController {

    private final UserWorkoutRepository userWorkoutRepository;
    private final UserShortRepository userShortRepository;
    private final WorkoutRepository workoutRepository;

    @Autowired
    public UserWorkoutController(UserWorkoutRepository userWorkoutRepository, WorkoutRepository workoutRepository,
                                    UserShortRepository userShortRepository) {
        this.userWorkoutRepository = userWorkoutRepository;
        this.workoutRepository = workoutRepository;
        this.userShortRepository = userShortRepository;
    }

    /**
     *
     * @param  workoutId to add.
     * @param userId  to add.
     * @return A response containing the added User/Workout with OK status code or
     * BAD_REQUEST status code if the workout is not found.
     */
    @PostMapping("/add/workout/{workout_id}/user/{user_id}")
    public ResponseEntity<UserWorkout> postUserWorkoutPair(@PathVariable(name = "workout_id") Long workoutId,
                                                            @PathVariable(name = "user_id") Long userId) {
        if ( (userId < 0) || (workoutId < 0) )
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        UserWorkout userworkout = new UserWorkout();
        userworkout.setUserId(userId);
        userworkout.setWorkoutId(workoutId);
        userWorkoutRepository.save(userworkout);
        return new ResponseEntity<>(userworkout, HttpStatus.OK);

    }

    /**
     * @param userId the UserWorkout to delete.
     * @return A response containing the added User/Workout with OK status code or
     * BAD_REQUEST status code if the workout is not found.
     */
    @Transactional
    @DeleteMapping("/remove/workout/{workout_id}/user/{user_id}")
    public ResponseEntity<UserWorkout> deleteUserWorkoutPair(@PathVariable(name = "workout_id") Long workoutId,
                                                             @PathVariable(name = "user_id") Long userId) {
        if(userWorkoutRepository.findByWorkoutIdAndUserId(workoutId, userId) == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        userWorkoutRepository.deleteByWorkoutIdAndUserId(workoutId, userId);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    /**
     * Gets users from specific workout
     * @param workoutId Workout to fetch users from.
     * @return A list of users with id and name.
     */
    @GetMapping("/get/userworkout/{workout_id}")
    public ResponseEntity<List<UserShort>> getUserWorkoutsFromWorkoutId(@PathVariable(name = "workout_id") Long workoutId){

        if (workoutId < 0)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        List<UserShort> list = userShortRepository.findNamesByWorkoutId(workoutId);

        if(list == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
