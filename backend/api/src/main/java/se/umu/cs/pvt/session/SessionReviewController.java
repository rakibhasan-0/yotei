package se.umu.cs.pvt.session;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


/**
 * Class for handling requests to the session review api.
 *
 * @author Granatäpple
 */
@RestController
@RequestMapping(path = "/api/session/{id}/review")
public class SessionReviewController {
    private SessionReviewRepository sessionReviewRepository;
    private SessionReviewExerciseRepository sessionReviewExerciseRepository;

    @Autowired
    public SessionReviewController(SessionReviewRepository planRepository, SessionReviewExerciseRepository sessionReviewExerciseRepository) {
        this.sessionReviewRepository = planRepository;
        this.sessionReviewExerciseRepository = sessionReviewExerciseRepository;
    }

    @GetMapping("all")
    public ResponseEntity<List<SessionReview>> all(
    @PathVariable("id") long id) {
        
        List<SessionReview> results = sessionReviewRepository.findAll();

        return new ResponseEntity<>(results, HttpStatus.OK);
    }


    @PostMapping("")
    public ResponseEntity<Object> createSessionReview(
    @PathVariable("id") long id, @RequestBody SessionReview review) {
        review.setSession_id(id);
        sessionReviewRepository.save(review);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @PostMapping("{review_id}/exercise")
    public ResponseEntity<Object> createSessionReviewExercise(@PathVariable("review_id") long review_id, @RequestBody SessionReviewExercise exercise) {
        exercise.setSession_review_id(review_id);
        sessionReviewExerciseRepository.save(exercise);
        return new ResponseEntity<>(exercise, HttpStatus.OK);
    }

    @DeleteMapping("{review_id}/exercise/{exercise_id}")
    public ResponseEntity<Object> deleteSessionReviewExercise(@PathVariable("review_id") long review_id, @PathVariable("exercise_id") long exercise_id) {
        if(sessionReviewExerciseRepository.findById(exercise_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);    
        }
        
        sessionReviewExerciseRepository.deleteById(exercise_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("{review_id}")
    public ResponseEntity<Object> deleteSessionReview(@PathVariable("review_id") long review_id) {
        if(sessionReviewRepository.findById(review_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);    
        }
        
        sessionReviewRepository.deleteById(review_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
