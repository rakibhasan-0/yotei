/**
 * The controller for the ExerciseTag entities. Includes informaton for all of the API calls for exerciseTag.
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
public class ExerciseTagController {


    /* Repositorys used by the ExerciseTagController. */
    private final ExerciseTagRepository exerciseTagRepository;
    private final TagRepository tagRepository;

    @Autowired
    public ExerciseTagController(ExerciseTagRepository exerciseTagRepository, TagRepository tagRepository) {
        this.exerciseTagRepository = exerciseTagRepository;
        this.tagRepository = tagRepository;
    }


    /**
     * Creates a Tag and Exercise pair.
     *
     * @param toAddExerciseTag The ExerciseTag entity without tagId (RequestBody).
     * @param tagId            The ID of the specified tag (RequestParam).
     * @return HTTP response
     * A response entity containing the added Exercise/Tag pair with status OK.
     * BAD_REQUEST if that tag ID doesn't exist.
     */
    @PostMapping("/add/exercise")
    public ResponseEntity<ExerciseTag> postExerciseTagPair(@RequestBody ExerciseTag toAddExerciseTag,
                                                           @RequestParam(name = "tag") Long tagId) {

        if (tagRepository.findById(tagId).orElse(null) != null) {
            toAddExerciseTag.setTag(tagRepository.findById(tagId).get());
            exerciseTagRepository.save(toAddExerciseTag);
            return new ResponseEntity<>(toAddExerciseTag, HttpStatus.OK);
        }
        return new ResponseEntity<>(toAddExerciseTag, HttpStatus.BAD_REQUEST);
    }


    /**
     * Finds all Exercise Ids that has a specific tag on it.
     *
     * @param tagId The tag Id of the specified tag.
     * @return HTTP reponse
     * A response entity with the list of Exercise ids with status OK.
     * BAD_REQUEST if no Exercises with that tag exist.
     */
    @GetMapping("/get/exercise/by-tag")
    public ResponseEntity<List<ExerciseTagShort>> getExerciseByTag(@RequestParam(name = "tag") Long tagId) {
        if (tagRepository.findById(tagId).orElse(null) != null) {
            return new ResponseEntity<>(exerciseTagRepository.findAllProjectedByTagId(tagId), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Finds all Tags for a given Exercise.
     *
     * @param exerciseId The Id of an exercise.
     * @return HTTP response
     * A response entity with the list of Tag elements with status OK.
     * BAD_REQUEST if Exercise has no tags.
     */
    @GetMapping("/get/tag/by-exercise")
    public ResponseEntity<List<TagResponse>> getTagByExercises(@RequestParam(name = "exerciseId") Long exerciseId) {
        if (exerciseTagRepository.findByExerciseId(exerciseId) != null) {
            return new ResponseEntity<>(exerciseTagRepository.findAllProjectedByExerciseId(exerciseId).stream()
                    .map(t -> new TagResponse(t.getTag().getId(), t.getTag().getName()))
                    .toList(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Removes a Tag from an Exercise by removing it from the ExerciseTag pair.
     *
     * @param toAddExerciseTag The ExerciseTag entity without tagId.
     * @param tagId            The Id of the specified tag.
     * @return HTTP response
     * OK is deletion successful.
     * BAD_REQUEST if deletion pair not found.
     */
    @Transactional
    @DeleteMapping("/remove/exercise")
    public ResponseEntity<ExerciseTag> deleteExerciseTagPair(@RequestBody ExerciseTag toAddExerciseTag,
                                                             @RequestParam(name = "tag") Long tagId) {
        if (tagRepository.findById(tagId).orElse(null) != null) {
            toAddExerciseTag.setTag(tagRepository.findById(tagId).get());
            if (exerciseTagRepository.findByExerciseIdAndTagId(toAddExerciseTag.getExerciseId(),
                    toAddExerciseTag.getTag()) != null) {
                exerciseTagRepository.deleteByExerciseIdAndTagId(toAddExerciseTag.getExerciseId(), toAddExerciseTag.getTag());
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    /**
     * Gets all ExerciseIds mapped by their Tags.
     *
     * @return HTTP reponse
     * OK if non-empty body is returned.
     * NO_CONTENT if there doesn't exist any tags for exercises.
     * BAD_REQUEST for faulty requests.
     */
    @GetMapping("/fetch/exercises/by-tag")
    public ResponseEntity<Map<Long, List<Long>>> getExercisesByTags() {
        HashMap<Long, List<Long>> exTags = new HashMap<>();

        // Fetch TechniqueTags for their Id.
        ArrayList<Tag> tags = (ArrayList<Tag>) tagRepository.findAll();
        for (Tag tag : tags) {
            Long tagId = tag.getId();
            ArrayList<Long> temp = new ArrayList<>();
            if (exerciseTagRepository.findAllProjectedByTagId(tagId) != null) {
                ArrayList<ExerciseTagShort> exerciseTags = (ArrayList<ExerciseTagShort>) exerciseTagRepository.findAllProjectedByTagId(tagId);
                for (ExerciseTagShort exTag : exerciseTags) {
                    temp.add(exTag.getExerciseId());
                }
            }
            // Ignore exercises with no tags.
            if (!temp.isEmpty()) {
                exTags.put(tagId, temp);
            }
        }

        // Check if there doesn't exist any tags for exercises.
        if (exTags.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        // Return the final response.
        return new ResponseEntity<>(exTags, HttpStatus.OK);
    }


    /**
     * Adds ExerciseTags to a given exercise.
     *
     * @param exerciseId   given exercise id.
     * @param exerciseTags ExerciseTags to be added.
     * @return HTTP status
     * OK if the setting of tags was successful.
     * BAD_REQUEST if no tags was found.
     */
    @PostMapping("/set-tags/exercises")
    public ResponseEntity<ExerciseTag> setExerciseTagsPost(@RequestParam(name = "exercise_id") long exerciseId,
                                                           @RequestBody ArrayList<ExerciseTag> exerciseTags) {

        return setExerciseTags(exerciseId, exerciseTags);
    }


    /**
     * Updates ExerciseTags for a given exercise.
     *
     * @param exerciseId   given exercise id.
     * @param exerciseTags ExerciseTags to be added.
     * @return HTTP status
     * OK if the setting of tags was successful.
     * BAD_REQUEST if no tags was found.
     */
    @PutMapping("/set-tags/exercises")
    public ResponseEntity<ExerciseTag> setExerciseTags(@RequestParam(name = "exercise_id") long exerciseId,
                                                       @RequestBody ArrayList<ExerciseTag> exerciseTags) {
        if (exerciseTags == null || exerciseTags.size() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Delete old exercise tags.
        exerciseTagRepository.deleteAll(exerciseTagRepository.findByExerciseId(exerciseId));

        for (ExerciseTag exerciseTag : exerciseTags) {

            // Finds a matching tag or creates a tag that matches the given tag object.
            Tag tempTag = tagRepository.getTagByName(exerciseTag.getTagObject().getName());
            if (tempTag == null) {
                tempTag = tagRepository.save(exerciseTag.getTagObject());
            }

            // Sets the tag to the exercise tag object and saves it.
            exerciseTag.setTag(tempTag);
            exerciseTag.setExerciseId(exerciseId);
            exerciseTagRepository.save(exerciseTag);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * Removes the ExerciseTags for a given exercise.
     *
     * @param exerciseId given exercise id.
     * @return HTTP response
     * OK if successful.
     */
    @DeleteMapping("/remove-tags/exercises/{exercise_id}")
    public ResponseEntity<ExerciseTag> deleteExerciseTagPair(@PathVariable("exercise_id") long exerciseId) {
        exerciseTagRepository.deleteAll(exerciseTagRepository.findByExerciseId(exerciseId));
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
