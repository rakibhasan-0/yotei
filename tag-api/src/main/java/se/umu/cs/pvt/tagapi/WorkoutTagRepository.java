/**
 * The WorkoutTagRepository for WorkoutTags.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tagapi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutTagRepository extends JpaRepository<WorkoutTag, Long>{
   /**
    * Finds all workouts for a specific tag.
    * @param tagId Id of the tag.
    * @return List of workouts Ids.
    */
   List<WorkoutTagShort> findAllProjectedByTagId(Long tagId);

   /**
    * Finds all tag Ids for a specific workout.
    * @param workId Id of the workout.
    * @return A list of tag Ids.
    */
   List<WorkoutTagShortId> findAllProjectedByWorkId(Long workId);

   /**
    * Finds a Workout Tag pair.
    * @param id Id of the workout.
    * @param tagId Id of the tag.
    * @return The WorkoutTag if it could be found else null.
    */
   WorkoutTag findByWorkIdAndTagId(Long id, Long tagId);

   /**
    * Deletes a Workout Tag pair.
    * @param id The Id of the workout.
    * @param tagId The Id of the tag.
    */
   void deleteByWorkIdAndTagId(Long id, Long tagId);

   /**
    * Finds all WorkoutTag entities with a given workId.
    * @param workId The specified workId.
    * @return A list of WorkoutTags.
    */
   List<WorkoutTag> findByWorkId(Long workId);
}
