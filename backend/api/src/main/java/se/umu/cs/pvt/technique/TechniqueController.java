package se.umu.cs.pvt.technique;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.media.MediaRepository;
import se.umu.cs.pvt.workout.Activity;
import se.umu.cs.pvt.workout.*;
import se.umu.cs.pvt.media.*;

import java.util.*;


/**
 * Class to get, insert, update, and remove technique.
 * <p>
 * Original by:
 *
 * @author Quattro Formaggio, Carlskrove, Hawaii (Doc: Griffin ens19amd)
 * <p>
 * Updated by:
 * @author Medusa
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/techniques")
public class TechniqueController {
    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private final TechniqueRepository techniqueRepository;

    @Autowired
    private final TechniqueReviewRepository techniqueReviewRepository;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    public TechniqueController(TechniqueRepository techniqueRepository, TechniqueReviewRepository techniqueReviewRepository) {
        this.techniqueRepository = techniqueRepository;
        this.techniqueReviewRepository = techniqueReviewRepository;
    }

    /**
     * Returns all techniques in the database, or if null is found: a
     * NOT_FOUND HttpStatus.
     *
     * @return all techniques or HttpStatus indicating no techniques found.
     */
    @GetMapping("")
    public ResponseEntity<Object> getTechniques() {

        List<Technique> allTechniques = techniqueRepository.findAll();

        if (allTechniques.isEmpty()) {
            return new ResponseEntity<>("Hittade inga sparade tekniker", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(allTechniques, HttpStatus.OK);
    }

    /**
     * Returns a technique depending on the id, or a HttpStatus indicating if
     * there is a bad request or no technique with id found.
     *
     * @param id the id.
     * @return a technique, or HttpStatus indicating error.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTechniques(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>("Inget ID angavs", HttpStatus.BAD_REQUEST);
        }

        if (id < 0) {
            return new ResponseEntity<>("ID på tekniker kan inte vara negativa", HttpStatus.BAD_REQUEST);
        }

        if (!techniqueRepository.existsById(id)) {
            return new ResponseEntity<>("Hittade ingen teknik med id: " + id, HttpStatus.NOT_FOUND);
        }

        Technique technique = techniqueRepository.findById(id).get();
        return new ResponseEntity<>(technique, HttpStatus.OK);
    }

    /**
     * This method adds a technique to the database.
     * <p>
     * Returns 201 CREATED if the technique is posted.
     * Returns 409 CONFLICT if the given name is taken.
     * Returns 409 NOT ACCEPTABLE if the given name is in a illegal format. (Too short or too long).
     * Returns 500 INTERNAL SERVER ERROR if an error occurs during the database transaction.
     *
     * @param toAdd the body in json format with correct attributes
     *              Example:
     *              {
     *              name: "cool_name",
     *              description: "cool_desc",
     *              belts: [{
     *              id: 1
     *              ]},
     *              tags: [{
     *              id: 1
     *              ]}
     *              }
     * @return responseEntity indicating the success-status of the post.
     */
    @PostMapping("")
    public ResponseEntity<Object> postTechnique(@RequestBody Technique toAdd) {
        toAdd.trimText();

        if (!techniqueRepository.findByNameIgnoreCase(toAdd.getName()).isEmpty()) {
            return new ResponseEntity<>("Tekniken med namnet '" + toAdd.getName() + "' finns redan", HttpStatus.CONFLICT);
        }

        if (!toAdd.validFormat()) {
            return new ResponseEntity<>("Fel format: Namn på teknik saknas eller är för långt.", HttpStatus.NOT_ACCEPTABLE);
        }

        try {
            return new ResponseEntity<>(techniqueRepository.save(toAdd), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Internt fel: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * This method updates an existing technique to the database. Technique
     * must have a name.
     * Omitting an attribute will null it. This is used to, for example, remove a tag.
     *
     * @param toUpdate the body in json format with correct attributes example:
     *                 {
     *                 id: 1,
     *                 name: "new cool_name",
     *                 description: "cool_desc",
     *                 belts: [{
     *                 id: 1
     *                 ]},
     *                 tags: [{
     *                 id: 1
     *                 ]}
     *                 }
     * @return HttpStatus indicating success or error.
     */
    @PutMapping("")
    public ResponseEntity<Object> updateTechnique(@RequestBody Technique toUpdate) {
        Long toUpdateID = toUpdate.getId();
        String toUpdateName = toUpdate.getName();
        List<TechniqueShort> existingTechniques = techniqueRepository.findByNameIgnoreCase(toUpdate.getName());

        if (techniqueRepository.findById(toUpdateID).isEmpty()) {
            return new ResponseEntity<>("Teknik med id " + toUpdateID + " hittades inte", HttpStatus.NOT_FOUND);
        }

        // If we update a technique but don't change the name we get a conflict.
        if (!existingTechniques.isEmpty()) {
            for (TechniqueShort technique : existingTechniques) {
                String existingName = technique.getName();
                Long existingID = technique.getId();

                if (toUpdateName.equals(existingName) && !toUpdateID.equals(existingID)) {
                    return new ResponseEntity<>("Tekniken med namnet '" + toUpdate.getName() + "' finns redan", HttpStatus.CONFLICT);
                }
            }
        }

        if (!toUpdate.validFormat()) {
            return new ResponseEntity<>("Fel format: Namn på teknik saknas eller är för långt", HttpStatus.NOT_ACCEPTABLE);
        }

        // A technique can't be updated if description is null, since its column is NOT NULL in the database.
        if (toUpdate.getDescription() == null) {
            toUpdate.setDescription("");
        }

        try {
            return new ResponseEntity<>(techniqueRepository.save(toUpdate), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Internt fel: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * This method removes an existing technique in the database. If the technique does not exist in the database a
     * BAD_REQUEST is returned.
     *
     * @param id The Id of the technique to remove.
     * @return Returns OK if the technique exists in the database, else BAD_REQUEST.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> removeTechnique(@PathVariable("id") Long id) {
        Optional<Technique> technique = techniqueRepository.findById(id);
        if (technique.isEmpty()) {
            return new ResponseEntity<>("Ingen teknik med ID " + id + " hittades", HttpStatus.NOT_FOUND);
        }

        //remove technique from any activity
        List<Activity> affectedActivities = findAssociatedActivities(id);

        //delete affected activities
        activityRepository.deleteAll(affectedActivities);

        // remove any existing media
        List<Media> existingMedia = this.mediaRepository.findAllMediaById(id);
        this.mediaRepository.deleteAll(existingMedia);

        //remove technique
        Technique toBeDeleted = technique.get();
        techniqueRepository.delete(toBeDeleted);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    private List<Activity> findAssociatedActivities(Long id) {
        List<Activity> activities = activityRepository.findAll();
        List<Activity> associatedActivities = new ArrayList<>();

        for (Activity activity : activities) {
            if (id.equals(activity.getTechniqueId())) {
                associatedActivities.add(activity);
            }
        }
        return associatedActivities;
    }


    /**
     * A method that is used to retrieve reviews for a technique from the database.
     *
     * @param id The id of the technique to retrieve reviews for.
     * @return ResponseEntity with the review information and HttpStatus OK.
     */
    @GetMapping("/reviews")
    public ResponseEntity<Object> getReviewsForTechnique(@RequestParam int id) {
        List<TechniqueReviewReturnInterface> list = techniqueReviewRepository.findReviewsForTechnique(id);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /**
     * A method for inserting a review for a technique into the database.
     *
     * @param review The review to insert.
     * @return The inserted review.
     */
    @PostMapping("/reviews")
    public ResponseEntity<Object> insertReviewForTechnique(@RequestBody TechniqueReview review) {
        techniqueReviewRepository.save(review);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    /**
     * A method for deleting a review for a technique from the database
     *
     * @param id The id for the review to delete
     * @return the id
     * HttpStatus
     * OK if technique with id exists
     * BAD_REQUEST if id is not valid
     * NOT FOUND if id is valid but not found
     */
    @DeleteMapping("/reviews")
    public ResponseEntity<Long> deleteReview(@RequestParam("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(id, HttpStatus.BAD_REQUEST);
        } else if (techniqueReviewRepository.findById(id).isPresent()) {
            techniqueReviewRepository.deleteById(id);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * A method for updating a review for a technique in the database
     *
     * @param review The review to update
     * @return the id
     * HttpStatus
     * OK if technique with id exists
     * BAD_REQUEST if id is not valid
     * NOT FOUND if id is valid but not found
     */
    @PutMapping("/reviews")
    public ResponseEntity<Object> updateReview(@RequestBody TechniqueReview review) {
        if (review == null || review.getId() == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else if (techniqueReviewRepository.findById(review.getId()).isPresent()) {
            techniqueReviewRepository.save(review);
            return new ResponseEntity<>(review, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(review, HttpStatus.NOT_FOUND);
        }
    }
}
