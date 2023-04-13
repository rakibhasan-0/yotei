/**
 * The WorkoutTagController for WorkoutTags.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tagapi;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
     * @param toAddWorkoutTag The WorkoutTag entity without tagId.
     * @param tagId The Id of the specified tag.
     * @return A response entity containing the added Workout/Tag pair with status OK or
     * BAD_REQUEST if that tag Id doesn't exist.
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
     * Finds all Workout Ids that has a given tag on it.
     * @param id The tag Id of the specified tag.
     * @return A response entity with the list of workout Ids with status OK or
     * BAD_REQUEST if no Workouts with that tag exist.
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
     * @param toAddWorkoutTag The WorkoutTag entity without tagId.
     * @param tagId The Id of the specified tag.
     * @return A response entity indicating if the Workout Tag pair has been successfully deleted or 
     * if the pair could not be found.
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
     * Finds all Tags for a given workout. 
     * @param id The Id of an workout.
     * @return A list of Tag elements.
     */
    @GetMapping("/get/tag/by-workout")
    public ResponseEntity<List<WorkoutTagShortId>> getTagByWorkout(@RequestParam(name = "workId") Long workId) {
        if (workoutTagRepository.findByWorkId(workId) != null) {
            return new ResponseEntity<>(workoutTagRepository.findAllProjectedByWorkId(workId), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    /**
     * Gets all workout Ids mapped by their tags
     * @return Response BAD_REQUEST for faulty requests, OK if a non-empty body is returned and NO_CONTENT if there
     * doesnt exist any tags for workouts.
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
