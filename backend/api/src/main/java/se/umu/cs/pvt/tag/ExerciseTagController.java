package se.umu.cs.pvt.tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * The controller for the ExerciseTag entities. Includes informaton for all of the API calls for exerciseTag.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
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
     * @deprecated /add/exercise
     */
    @PostMapping(value={"/exercises","/add/exercise"})
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
     * Finds all Tags for a given Exercise.
     *
     * @param exerciseId The Id of an exercise.
     * @return HTTP response
     * A response entity with the list of Tag elements with status OK.
     * BAD_REQUEST if Exercise has no tags.
     * @deprecated /get/tag/by-exercise
     */
    @GetMapping(value={"", "/get/tag/by-exercise"}, params = "exerciseId")
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
     * @deprecated /remove/exercise
     */
    @Transactional
    @DeleteMapping(value={"/exercises", "/remove/exercise"})
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
     * Removes the ExerciseTags for a given exercise.
     *
     * @param exerciseId given exercise id.
     * @return HTTP response
     * OK if successful.
     * @deprecated /remove-tags/exercises/{exercise_id}
     */
    @DeleteMapping(value={"/exercises/{exercise_id}", "/remove-tags/exercises/{exercise_id}"})
    public ResponseEntity<ExerciseTag> deleteExerciseTagPair(@PathVariable("exercise_id") long exerciseId) {
        exerciseTagRepository.deleteAll(exerciseTagRepository.findByExerciseId(exerciseId));
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
