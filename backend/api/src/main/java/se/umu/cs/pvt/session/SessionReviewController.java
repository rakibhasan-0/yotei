package se.umu.cs.pvt.session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import se.umu.cs.pvt.workout.Activity;
import se.umu.cs.pvt.workout.detail.ActivityDetail;

import java.util.List;
import java.util.Optional;
import java.util.Set;


/**
 * Class for handling requests to the session review api.
 *
 * @author Granatäpple (c21man)
 */
@RestController
@RequestMapping(path = "/api/session/{id}/review")
public class SessionReviewController {
    private SessionReviewRepository sessionReviewRepository;
    private SessionReviewActivityRepository sessionReviewActivityRepository;


    /**
     * Constructor for the session review controller.
     * @param planRepository
     * @param sessionReviewExerciseRepository
     */
    @Autowired
    public SessionReviewController(SessionReviewRepository planRepository, SessionReviewActivityRepository sessionReviewExerciseRepository) {
        this.sessionReviewRepository = planRepository;
        this.sessionReviewActivityRepository = sessionReviewExerciseRepository;
    }

    public SessionReviewController() {
    }

    /**
     * Get all session reviews by id
     * 
     * @param id The session id.
     * @return HTTP-status code and the list of sessions reviews.
     */
    @GetMapping("all")
    public ResponseEntity<List<SessionReview>> all(
    @PathVariable("id") long id) {
        
        List<SessionReview> results = sessionReviewRepository.findAllBySessionId(id);

        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    /**
     * Create a new session review
     * 
     * @param id The session id.
     * @param session Object mapped session review from request body.
     * @return HTTP-status code and the created session review.
     */
    @PostMapping("")
    public ResponseEntity<Object> createSessionReview(
    @PathVariable("id") long id, @RequestBody SessionReview review) {
        review.setSession_id(id);
        sessionReviewRepository.save(review);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }


    /**
     * Add a completed excersise to a session review.
     * 
     * @param review_id The session review id.
     * @param activity Object mapped session review activity from request body.
     * @return HTTP-status code and the created session review exercise.
     */
    @PostMapping("{review_id}/activity")
    public ResponseEntity<Object> createSessionReviewActivity(@PathVariable("review_id") long review_id, @RequestBody SessionReviewActivity activity) {
        if(sessionReviewRepository.findById(review_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        activity.setSession_review_id(review_id);
        sessionReviewActivityRepository.save(activity);
        return new ResponseEntity<>(activity, HttpStatus.OK);
    }

    @GetMapping("extraactivities")
    public ResponseEntity<ExtraActivitiesDTO> getAnonymousActivities(@PathVariable("id") long id) {
        List<ActivityDetail> activities = sessionReviewRepository.findAnonymousActivitiesForSession(id);

        if (activities.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(new ExtraActivitiesDTO("Extra", 99, activities), HttpStatus.OK);
    }

    /**
     * Delete a completed activity from a session review.
     * 
     * @param review_id The session review id.
     * @param activity_id The activity id.
     * @param session Object mapped session review from request body.
     * @return HTTP-status code.
     */
    @DeleteMapping("{review_id}/activity/{exercise_id}")
    public ResponseEntity<Object> deleteSessionReviewActivity(@PathVariable("review_id") long review_id, @PathVariable("exercise_id") long activity_id) {
        if(sessionReviewActivityRepository.findById(activity_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);    
        }
        
        sessionReviewActivityRepository.deleteById(activity_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * Delete all completed activity from a session review.
     * 
     * @param review_id The session review id.
     * @param activity_id The exercise id.
     * @param session Object mapped session review from request body.
     * @return HTTP-status code.
     */
    @DeleteMapping("{review_id}/activity")
    public ResponseEntity<Object> deleteAllSessionReviewActivity(@PathVariable("review_id") long review_id) {
        Optional<SessionReview> review;
        if((review = sessionReviewRepository.findById(review_id)).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);    
        }

        SessionReview actual_review = review.get();

        Set<SessionReviewActivity> activities = actual_review.getActivities();
        for (SessionReviewActivity sessionReviewActivity : activities) {
            sessionReviewActivityRepository.deleteById(sessionReviewActivity.getSession_review_activity_id());
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Delete a session review.
     * 
     * @param review_id The session review id.
     * @param session Object mapped session review from request body.
     * @return HTTP-status code.
     */
    @DeleteMapping("{review_id}")
    public ResponseEntity<Object> deleteSessionReview(@PathVariable("review_id") long review_id) {
        if(sessionReviewRepository.findById(review_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);    
        }
        
        sessionReviewRepository.deleteById(review_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Update a session review.
     * 
     * @param review_id The session review id.
     * @param session Object mapped session review from request body.
     * @return HTTP-status code.
     */
    @PutMapping("")
    public ResponseEntity<Object> updateSessionReview( @RequestBody SessionReview updated_review) {
        if(sessionReviewRepository.findById(updated_review.getId()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        sessionReviewRepository.save(updated_review);
    
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
