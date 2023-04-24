/**
 * The repository used for the TechniqueTags.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechniqueTagRepository extends JpaRepository<TechniqueTag, Long>{
   /**
    * Finds all techniques for a specific tag.
    * @param tagId Id of the tag.
    * @return List of techniques Ids.
    */
   List<TechniqueTagShort> findAllProjectedByTagId(Long tagId);

   /**
    * Finds all tag Ids for a specific technique.
    * @param techId The id of the specified technique.
    * @return A list of tag IDs.
    */
   List<TechniqueTagShortId> findAllProjectedByTechId(Long techId);

   /**
    * Finds a Technique Tag pair.
    * @param id Id of the technique.
    * @param tagId Id of the tag.
    * @return The TechniqueTag if it could be found else null.
    */
    TechniqueTag findByTechIdAndTagId(Long id, Long tagId);

   /**
    * Deletes a Technique Tag pair.
    * @param id The Id of the technique.
    * @param tagId The Id of the tag.
    */
   void deleteByTechIdAndTagId(Long id, Long tagId);

   /**
    * Finds all TechniqueTag entities with a given techId. 
    * @param techId The specified techId.
    * @return A list of TechniqueTags.
   */
   List<TechniqueTag> findByTechId(Long techId);
}
