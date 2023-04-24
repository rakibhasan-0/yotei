/**
 * The controller for the ExerciseTag entities. Includes informaton for all of the API calls for exerciseTag.
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
import org.springframework.web.bind.annotation.*;

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
     * @param toAddExerciseTag The ExerciseTag entity without tagId (RequestBody).
     * @param tagId The Id of the specified tag (RequestParam).
     * @return A response entity containing the added Exercise/Tag pair with status OK or
     * BAD_REQUEST if that tag Id doesn't exist.
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
     * @param tagId The tag Id of the specified tag.
     * @return A response entity with the list of Exercise ids with status OK or
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
     * @param exerciseId The Id of an exercise.
     * @return A list of Tag elements.
     */
    @GetMapping("/get/tag/by-exercise")
    public ResponseEntity<List<ExerciseTagShortId>> getTagByExercises(@RequestParam(name = "exerciseId") Long exerciseId ) {
        if (exerciseTagRepository.findByExerciseId(exerciseId) != null) {
            return new ResponseEntity<>(exerciseTagRepository.findAllProjectedByExerciseId(exerciseId), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Removes a Tag from an Exercise by removing it from the ExerciseTag pair.
     * @param toAddExerciseTag The ExerciseTag entity without tagId.
     * @param tagId The Id of the specified tag.
     * @return A response entity indicating if the Exercise Tag pair has been successfully deleted or 
     * if the pair could not be found.
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
     * @return Response BAD_REQUEST for faulty requests, OK if a non-empty body is returned and NO_CONTENT if there
     * doesnt exist any tags for exercises.
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
     * @param exerciseId given exercise id.
     * @param exerciseTags ExerciseTags to be added.
     * @return HTTP status
     * BAD_REQUEST if no tags was found
     * OK if the setting of tags was successful
     */
    @PostMapping("/set-tags/exercises")
    public ResponseEntity<ExerciseTag> setExerciseTagsPost(@RequestParam(name = "exercise_id") long exerciseId,
                                                       @RequestBody ArrayList<ExerciseTag> exerciseTags) {
        return setExerciseTags(exerciseId, exerciseTags);
    }

    /**
     * Updates ExerciseTags for a given exercise.
     * @param exerciseId given exercise id.
     * @param exerciseTags ExerciseTags to be added.
     * @return HTTP status
     * BAD_REQUEST if no tags was found
     * OK if the setting of tags was successful
     */
    @PutMapping("/set-tags/exercises")
    public ResponseEntity<ExerciseTag> setExerciseTags(@RequestParam(name = "exercise_id") long exerciseId,
                                                            @RequestBody ArrayList<ExerciseTag> exerciseTags) {
        if(exerciseTags == null || exerciseTags.size() == 0){
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
     * @param exerciseId given exercise id.
     * @return success message if successful.
     */
    @DeleteMapping("/remove-tags/exercises/{exercise_id}")
    public ResponseEntity<ExerciseTag> deleteExerciseTagPair(@PathVariable("exercise_id") long exerciseId) {
        exerciseTagRepository.deleteAll(exerciseTagRepository.findByExerciseId(exerciseId));
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * Imports a mapping between techniques and tags into the database.
     * New techniques and relations between techniques and tags are added
     * as needed.
     * @param tagMap A list containing mappings between exercise ids and
     *               tag names.
     * @return Http status.
     */
    @PostMapping("/import/exercises")
    public ResponseEntity postImport(@RequestBody List<ExerciseTagMap> tagMap) {
        for (ExerciseTagMap tagMapping:tagMap) {
            for (Tag tag:tagMapping.getTags()) {
                Tag tagInDatabase = null;
                try {
                    tagInDatabase = tagRepository.save(tag);
                } catch (Exception e) {
                    tagInDatabase = tagRepository.getTagByName(tag.getName());
                }
                ExerciseTag exerciseTag = new ExerciseTag();
                exerciseTag.setExerciseId(tagMapping.getExerciseId());
                exerciseTag.setTag(tagInDatabase);
                if (exerciseTagRepository.findByExerciseIdAndTagId(exerciseTag.getExerciseId(), exerciseTag.getTag()) == null)
                {
                    exerciseTagRepository.save(exerciseTag);
                }
            }
        }
        return new ResponseEntity(HttpStatus.OK);
    }


    /**
     * Fetches a list of tags associated with the list of exercise ids
     * taken as a parameter.
     * @param exerciseIds exercise ids for which tags will be fetched.
     * @return Http response with the fetched tags.
     */
    @GetMapping("/export/exercises")
    public ResponseEntity getExport(@RequestParam(name = "exerciseIds") List<Long> exerciseIds) {
        List<List<String>> response = new ArrayList<>();
        for (Long id:exerciseIds) {
            if (exerciseTagRepository.findByExerciseId(id) != null) {
                List<String> responsePart = new ArrayList<>();
                List<ExerciseTag> exerciseTags = exerciseTagRepository.findByExerciseId(id);
                for (ExerciseTag exerciseTag:exerciseTags) {
                    responsePart.add(exerciseTag.getTagObject().getName());
                }
                response.add(responsePart);
            }
            else {
                System.out.println("Exercise does not exist");
            }
        }
        return new ResponseEntity(response, HttpStatus.OK);
    }
}
