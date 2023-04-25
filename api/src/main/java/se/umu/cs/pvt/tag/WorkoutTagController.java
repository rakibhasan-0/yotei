/**
 * The WorkoutTagController for WorkoutTags.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/tags")
public class WorkoutTagController {

    /* Repositorys used by the WorkoutTagController. */
    private final WorkoutTagRepository workoutTagRepository;
    private final TagRepository tagRepository;

    @Autowired
    public WorkoutTagController(WorkoutTagRepository workoutTagRepository, TagRepository tagRepository) {
        this.workoutTagRepository = workoutTagRepository;
        this.tagRepository = tagRepository;
    }

    /**
     * Creats a Tag and Workout pair.
     *
     * @param   toAddWorkoutTag     The WorkoutTag entity without TagId.
     * @param   tagId               The ID of the specified Tag.
     * @return                      HTTP reponse
     *                                  A response entity containing the added Workout/Tag pair with status OK.
     *                                  BAD_REQUEST if that Tag ID doesn't exist.
     */ 
    @PostMapping("/add/workout")
    public ResponseEntity<WorkoutTag> postWorkoutTagPair(@RequestBody WorkoutTag toAddWorkoutTag,
                                                         @RequestParam(name = "tag") Long tagId) {
        if (tagRepository.findById(tagId).orElse(null) != null) {
            toAddWorkoutTag.setTag(tagRepository.findById(tagId).get());
            workoutTagRepository.save(toAddWorkoutTag);
            return new ResponseEntity<>(toAddWorkoutTag, HttpStatus.OK);
        }
        return new ResponseEntity<>(toAddWorkoutTag, HttpStatus.BAD_REQUEST);
    }


    /**
     * Finds all Workout IDs that has a given Tag on it.
     *
     * @param   id      The Tag ID of the specified Tag.
     * @return          HTTP reponse
     *                      A response entity with the list of Workout IDs with status OK.
     *                      BAD_REQUEST if no Workouts with that Tag exist.
     */
    @GetMapping("/get/workout/by-tag")
    public ResponseEntity<List<WorkoutTagShort>> getWorkoutByTag(@RequestParam(name = "tag") Long id) {
        if (tagRepository.findById(id).orElse(null) != null) {
            return new ResponseEntity<>(workoutTagRepository.findAllProjectedByTagId(id), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    /**
     * Removes a given Workout Tag pair.
     *
     * @param   toAddWorkoutTag     The WorkoutTag entity without TagId.
     * @param   tagId               The ID of the specified Tag.
     * @return                      HTTP response
     *                                  OK if the Workout Tag pair has been successfully deleted.
     *                                  BAD_REQUEST if the pair could not be found.
     */
    @Transactional
    @DeleteMapping("/remove/workout") 
    public ResponseEntity<WorkoutTag> deleteWorkoutTagPair(@RequestBody WorkoutTag toAddWorkoutTag, 
                                                            @RequestParam(name = "tag") Long tagId) {
        if (tagRepository.findById(tagId).orElse(null) != null) {
            toAddWorkoutTag.setTag(tagRepository.findById(tagId).get());
            if (workoutTagRepository.findByWorkIdAndTagId(toAddWorkoutTag.getWorkId(), 
                                                                               toAddWorkoutTag.getTag()) != null) {
                workoutTagRepository.deleteByWorkIdAndTagId(toAddWorkoutTag.getWorkId(), toAddWorkoutTag.getTag());
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    /**
     * Finds all Tags for a given Workout.
     *
     * @param   workId      The ID of an Workout.
     * @return              HTTP response
     *                          A reponse entity with a list of the Tag elements and status OK.
     *                          BAD_REQUEST if Workout has no Tags.
     */
    @GetMapping("/get/tag/by-workout")
    public ResponseEntity<List<WorkoutTagShortId>> getTagByWorkout(@RequestParam(name = "workId") Long workId) {
        if (workoutTagRepository.findByWorkId(workId) != null) {
            return new ResponseEntity<>(workoutTagRepository.findAllProjectedByWorkId(workId), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }


    /**
     * Gets all Workout IDs mapped by their Tags.
     *
     * @return          HTTP response
     *                      OK if a non-empty body is returned.
     *                      NO_CONTENT if there doesn't exist any tags for workouts.
     *                      BAD_REQUEST for faulty requests.
     */ 
    @GetMapping("/fetch/workouts/by-tag")
    public ResponseEntity<Map<Long, List<Long>>> getWorkoutsByTags() {
        HashMap<Long, List<Long>> workTags = new HashMap<>();

        // Fetch TechniqueTags for their Id.
        ArrayList<Tag> tags = (ArrayList<Tag>) tagRepository.findAll();
        for (Tag tag : tags) {
            Long tagId = tag.getId();
            ArrayList<Long> temp = new ArrayList<>();
            if (workoutTagRepository.findAllProjectedByTagId(tagId) != null) {
                ArrayList<WorkoutTagShort> workoutTags = (ArrayList<WorkoutTagShort>) workoutTagRepository.findAllProjectedByTagId(tagId);
                for (WorkoutTagShort workTag : workoutTags) {
                    temp.add(workTag.getWorkId());
                } 
            }
            // Ignore workouts with no tags.
            if (!temp.isEmpty()) {
                workTags.put(tagId, temp); 
            }
        }

        // Check if there doesn't exist any tags for workouts.
        if (workTags.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        // Return the final response
        return new ResponseEntity<>(workTags, HttpStatus.OK);
    }
}
