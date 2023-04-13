/**
 * The repository used for the ExerciseTag entities. Based on Spring JPA Repository.
 * @author Grupp 5 Verona
 */

package se.umu.cs.pvt.tagapi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseTagRepository extends JpaRepository<ExerciseTag, Long> {
    
    /**
    * Finds all exercises for a specific tag.
    * @param tagId Id of the tag.
    * @return List of exercise ids.
    */
   List<ExerciseTagShort> findAllProjectedByTagId(Long tagId);

   /**
    * Finds a Exercise Tag pair.
    * @param id Id of the exercise.
    * @param tagId Id of the tag.
    * @return The ExerciseTag if it could be found else null.
    */
   ExerciseTag findByExerciseIdAndTagId(Long id, Long tagId);

   /**
    * Deletes a Exercise Tag pair.
    * @param id The Id of the Exercise.
    * @param tagId The Id of the tag.
    */
   void deleteByExerciseIdAndTagId(Long id, Long tagId);

   List<ExerciseTagShortId> findAllProjectedByExerciseId(Long exerciseId);

   List<ExerciseTag> findByExerciseId(Long exerciseId);



}
