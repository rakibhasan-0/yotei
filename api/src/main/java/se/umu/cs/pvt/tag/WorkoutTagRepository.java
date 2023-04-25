/**
 * The WorkoutTagRepository for WorkoutTags.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface WorkoutTagRepository extends JpaRepository<WorkoutTag, Long>{

   /**
    * Finds all Workouts for a specific Tag ID.
    *
    * @param   tagId       ID of the Tag.
    * @return              List of Workouts IDs.
    */
   List<WorkoutTagShort> findAllProjectedByTagId(Long tagId);


   /**
    * Finds all Tag IDs for a specific Workout.
    *
    * @param   workId      ID of the Workout.
    * @return              A list of Tag IDs.
    */
   List<WorkoutTagShortId> findAllProjectedByWorkId(Long workId);


   /**
    * Finds a Workout Tag pair.
    *
    * @param   id          ID of the Workout.
    * @param   tagId       ID of the Tag.
    * @return              The WorkoutTag if it could be found else null.
    */
   WorkoutTag findByWorkIdAndTagId(Long id, Long tagId);


   /**
    * Deletes a Workout Tag pair.
    *
    * @param   id          The ID of the Workout.
    * @param   tagId       The ID of the Tag.
    */
   void deleteByWorkIdAndTagId(Long id, Long tagId);


   /**
    * Finds all WorkoutTag entities with a given workId.
    *
    * @param   workId      The ID of the Workout.
    * @return              A list of WorkoutTags.
    */
   List<WorkoutTag> findByWorkId(Long workId);
}
