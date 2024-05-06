package se.umu.cs.pvt.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * The repository used for the TechniqueTags.
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
@Repository
public interface TechniqueTagRepository extends JpaRepository<TechniqueTag, Long> {

   /**
    * Finds all Techniques for a specific Tag.
    *
    * @param   tagId    ID of the Tag.
    * @return           List of Techniques IDs.
    */
   List<TechniqueTagShort> findAllProjectedByTagId(Long tagId);


   /**
    * Finds all tag IDs for a specific Technique.
    *
    * @param   techId      The iD of the specified Technique.
    * @return              A list of Tag IDs.
    */
   List<TechniqueTagShortId> findAllProjectedByTechId(Long techId);


   /**
    * Finds a Technique Tag pair.
    *
    * @param   id       ID of the Technique.
    * @param   tagId    ID of the Tag.
    * @return           The TechniqueTag if it could be found else null.
    */
    TechniqueTag findByTechIdAndTagId(Long id, Long tagId);


   /**
    * Deletes a Technique Tag pair.
    *
    * @param   id       The ID of the Technique.
    * @param   tagId    The ID of the Tag.
    */
   void deleteByTechIdAndTagId(Long id, Long tagId);


   /**
    * Finds all TechniqueTag entities with a given Technique ID.
    *
    * @param   techId      The specified Technique ID.
    * @return              A list of TechniqueTags.
   */
   List<TechniqueTag> findByTechId(Long techId);
}
