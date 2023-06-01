package se.umu.cs.pvt.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ExerciseCommentController is a controller for the ExerciseComment entity.
 * It handles all requests to the /exerciseComments endpoint.
 * @author Henrik Aili (c20hai) - Grupp 3 Hawaii, modified by Cyclops 2023-05-04
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
      * @param userId the users id, accessed through the Header.
      */
     @PostMapping("/exercise/add")
     public ResponseEntity<String> addExerciseComment(@RequestParam(name = "id") Long exerciseId, @RequestBody Comment toAdd,
                                                       @RequestHeader("userId") Long userId) {

          toAdd.setExerciseId(exerciseId);
          toAdd.setUserId(userId);
          toAdd.setDate();
          if(!validateComment(toAdd)){
               return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
          }
          return addCommentToDB(toAdd);
     }

     /**
      * Get all comments for an exercise.
      * @param exerciseId the id of the exercise
      * @return the comments for the exercise
      */
     @GetMapping("/exercise/get")
     public ResponseEntity<List<Comment>> getExerciseComments(@RequestParam(name = "id") Long exerciseId) {
          try {
               return new ResponseEntity<>(commentRepository.findALLProjectedByExerciseId(exerciseId), HttpStatus.OK);
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
     private ResponseEntity<String> addCommentToDB(Comment toAdd) {
          commentRepository.save(toAdd);
          return new ResponseEntity<>(HttpStatus.CREATED);
     }

     /**
      * Checks a comment if it is valid.
      * @param toAdd the comment to check
      */
     private Boolean validateComment(Comment toAdd) {
          return toAdd.getCommentText() != null && toAdd.getUserId() != null && toAdd.getExerciseId() != null;
     }


}
