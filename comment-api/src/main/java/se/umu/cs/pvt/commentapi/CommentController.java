package se.umu.cs.pvt.commentapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ExerciseCommentController is a controller for the ExerciseComment entity.
 * It handles all requests to the /exerciseComments endpoint.
 * @author Henrik Aili (c20hai) - Grupp 3 Hawaii
 */
@RestController
@CrossOrigin
@RequestMapping("/api/comment")
public class CommentController {

     private final CommentRepository commentRepository;

     /**
      * Constructor for ExerciseCommentController.
      * @param commentRepository the repository to use
      */
     @Autowired
     public CommentController( CommentRepository commentRepository) {
          this.commentRepository = commentRepository;
     }

     /**
      * Add a comment to an exercise.
      * @param exerciseId the id of the exercise
      * @param toAdd the comment to add
      */
     @PostMapping("/exercise/add")
     public ResponseEntity<Comment> addExerciseComment(@RequestParam(name = "id") Long exerciseId, @RequestBody Comment toAdd) {
          toAdd.setExerciseId(exerciseId);
          return checkComment(toAdd);
     }


     /**
      * Add a comment to a workout.
      * @param workoutId the id of the workout
      * @param toAdd the comment to add
      */
     @PostMapping("/workout/add")
     public ResponseEntity<Comment> addWorkoutComment(@RequestParam(name = "id") Long workoutId, @RequestBody Comment toAdd) {
          toAdd.setWorkoutId(workoutId);
          return checkComment(toAdd);
     }

     /**
      * Get all comments for an exercise.
      * @param exerciseId the id of the exercise
      * @return the comments for the exercise
      */
     @GetMapping("/exercise/get")
     public ResponseEntity<List<CommentShort>> getExerciseComments(@RequestParam(name = "id") Long exerciseId) {
          try {
               return new ResponseEntity<>(commentRepository.findALLProjectedByExerciseId(exerciseId), HttpStatus.OK);
          } catch (Exception e) {
               return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
          }
     }

     /**
      * Get all comments for a workout.
      * @param workoutId the id of the workout
      * @return the comments
      */
     @GetMapping("/workout/get")
     public ResponseEntity<List<CommentShort>> getWorkoutComments(@RequestParam(name = "id") Long workoutId) {
          try {
               return new ResponseEntity<>(commentRepository.findALLProjectedByWorkoutId(workoutId), HttpStatus.OK);
          } catch (Exception e) {
               return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
          }
     }

     /**
      * Remove a comment
      * @param id the id of the comment
      * @return the removed comment
      */
     @DeleteMapping("/delete")
     public ResponseEntity<Long> deleteComment(@RequestParam(name = "id") Long id) {
          try {
               commentRepository.deleteById(id);
               return new ResponseEntity<>(id, HttpStatus.OK);
          } catch (Exception e) {
               return new ResponseEntity<>(id, HttpStatus.BAD_REQUEST);
          }
     }

     /**
      * Checks if the comment is valid and if it is, adds it to the database.
      * @param toAdd the comment to add
      * @return the comment if it is valid, otherwise null
      */
     private ResponseEntity<Comment> checkComment(Comment toAdd) {
          if (checkCommentText(toAdd.getCommentText())) {
               commentRepository.save(toAdd);
               return new ResponseEntity<>(toAdd, HttpStatus.CREATED);
          }
          else {
               return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
          }
     }

     /**
      * Checks a comment if it is valid.
      * @param textToCheck the comment to check
      */
     private Boolean checkCommentText(String textToCheck) {
          return textToCheck != null && !textToCheck.isBlank();
     }


}
