package se.umu.cs.pvt.workoutapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(path = "/api/workouts/activities")
public class ActivityController {
    @Autowired
    private ActivityRepository activityRepository;

    public ActivityController(ActivityRepository ar) {
        this.activityRepository = ar;
    }

    /**
     * Returns all activities of workout with id in the database
     * @return a list of all activities of workout with id in the database
     *          HttpStatus
     *          BAD_REQUEST if workout with id does not exist
     *          OK if workout with id exists
     */
    @GetMapping("/all/{id}")
    public ResponseEntity<List<Activity>> getActivities(@PathVariable Long id) {
        if (id == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(activityRepository.findAllByWorkoutId(id), HttpStatus.OK);
    }

    /**
     * This method adds an activity to the database
     * @param toAdd the body in json format with correct attributes example:
     *              {"workoutId":13,"exerciseId":5,"techniqueId":null,
     *              "name":"uppdateratNamn","desc":"desc","duration":1,"order":1}
     * @return the added workout
     *          HttpStatus
     *          BAD_REQUEST if activity has incorrect format
     *          CREATED always
     */
    @PostMapping("/add")
    public ResponseEntity<Activity> addActivity(@RequestBody Activity toAdd) {
        if (toAdd == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        activityRepository.save(toAdd);
        return new ResponseEntity<>(toAdd, HttpStatus.CREATED);
    }

    /**
     * Update an existing activity
     * @param toUpdate The updated activity (with id).
     *                 {"id":8,"workoutId":13,"exerciseId":5,"techniqueId":null,
     *                 "name":"uppdateratNamn","desc":"desc","duration":1,"order":1}
     * @return the updated workout.
     *          HttpStatus
     *          OK if activity with id exists
     *          BAD_REQUEST if activity has invalid id
     *          NOT_FOUND if activity has valid id but could not be found
     *
     */
    @PutMapping("/update")
    public ResponseEntity<Activity> updateActivity(@RequestBody Activity toUpdate) {
        if (toUpdate == null || toUpdate.getId() == null){
            return new ResponseEntity<>(toUpdate, HttpStatus.BAD_REQUEST);
        } else if (activityRepository.findById(toUpdate.getId()).isPresent()){
            activityRepository.save(toUpdate);
            return new ResponseEntity<>(toUpdate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(toUpdate, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Deletes an activity with specified id
     * @param id the id of the activity to delete
     * @return the id of the deleted activity
     *         HttpStatus
     *         OK if activity with id exists
     *         BAD_REQUEST if id is not valid
     *         NOT FOUND if id is valid but not found
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Long> deleteActivity(@PathVariable("id") Long id) {
        if (id == null){
            return new ResponseEntity<>(id, HttpStatus.BAD_REQUEST);
        } else if (activityRepository.findById(id).isPresent()){
            activityRepository.deleteById(id);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
        }
    }
}
