/**
 * The controller for the TechniqueTag entities.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
public class TechniqueTagController {

    /* Repositorys used by the TechniqueTagController. */
    private final TechniqueTagRepository techniqueTagRepository;
    private final TagRepository tagRepository;

    @Autowired
    public TechniqueTagController(TechniqueTagRepository techniqueTagRepository, TagRepository tagRepository) {
        this.techniqueTagRepository = techniqueTagRepository;
        this.tagRepository = tagRepository;
    }

    /**
     * Creates a Tag and Technique pair.
     * @param toAddTechniqueTag The TechniqueTag entity without tagId.
     * @param tagId The Id of the specified tag.
     * @return A response entity containing the added Technique/Tag pair with status OK or
     * BAD_REQUEST if that tag Id doesn't exist.
     */ 
    @PostMapping("/add/technique")
    public ResponseEntity<TechniqueTag> postTechniqueTagPair(@RequestBody TechniqueTag toAddTechniqueTag,
                                                             @RequestParam(name = "tag") Long tagId) {
        if (tagRepository.findById(tagId).orElse(null) != null) {
            toAddTechniqueTag.setTag(tagRepository.findById(tagId).get());
            techniqueTagRepository.save(toAddTechniqueTag);
            return new ResponseEntity<>(toAddTechniqueTag, HttpStatus.OK);
        }
        return new ResponseEntity<>(toAddTechniqueTag, HttpStatus.BAD_REQUEST);
    }

    /**
     * Finds all Technique Ids that has a given tag on it.
     * @param id The tag Id of the specified tag.
     * @return A response entity with the list of Technique ids with status OK or
     * BAD_REQUEST if no Techniques with that tag exist.
     */
    @GetMapping("/get/technique/by-tag")
    public ResponseEntity<List<TechniqueTagShort>> getTechniqueByTag(@RequestParam(name = "tag") Long id) {
        if (tagRepository.findById(id).orElse(null) != null) {
            return new ResponseEntity<>(techniqueTagRepository.findAllProjectedByTagId(id), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Removes a given Technique Tag pair.
     * @param toAddTechniqueTag The TechniqueTag entity without tagId.
     * @param tagId The Id of the specified tag.
     * @return A response entity indicating if the Technique Tag pair has been successfully deleted or 
     * if the pair could not be found.
     */
    @Transactional
    @DeleteMapping("/remove/technique") 
    public ResponseEntity<TechniqueTag> deleteTechniqueTagPair(@RequestBody TechniqueTag toAddTechniqueTag, 
                                                            @RequestParam(name = "tag") Long tagId) {
        if (tagRepository.findById(tagId).orElse(null) != null) {
            toAddTechniqueTag.setTag(tagRepository.findById(tagId).get());
            if (techniqueTagRepository.findByTechIdAndTagId(toAddTechniqueTag.getTechId(), 
                                                                               toAddTechniqueTag.getTag()) != null) {
                techniqueTagRepository.deleteByTechIdAndTagId(toAddTechniqueTag.getTechId(), toAddTechniqueTag.getTag());
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Gets the tags related to a technique.
     * @param techId The technique id
     * @return A List of Integers with the tag ids
     */
    @GetMapping("/get/tag/by-technique")
    public ResponseEntity<List<TechniqueTagShortId>> getTagByTechnique(@RequestParam(name = "techId") Long techId) {
        if (techniqueTagRepository.findByTechId(techId) != null) {
            return new ResponseEntity<>(techniqueTagRepository.findAllProjectedByTechId(techId), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Gets all TechniqueIds mapped by their Tags
     * @return Response BAD_REQUEST for faulty requests, OK if a non-empty body is returned and NO_CONTENT if there
     * doesnt exist any tags for techniques.
     */ 
    @GetMapping("/fetch/techniques/by-tag")
    public ResponseEntity<Map<Long, List<Long>>> getTechniquesByTags() {
        HashMap<Long, List<Long>> techTags = new HashMap<>();

        // Fetch TechniqueTags for their Id.
        ArrayList<Tag> tags = (ArrayList<Tag>) tagRepository.findAll();
        for (Tag tag : tags) {
            Long tagId = tag.getId();
            ArrayList<Long> temp = new ArrayList<>();
            if (techniqueTagRepository.findAllProjectedByTagId(tagId) != null) {
                ArrayList<TechniqueTagShort> techniqueTags = (ArrayList<TechniqueTagShort>) techniqueTagRepository.findAllProjectedByTagId(tagId);
                for (TechniqueTagShort techTag : techniqueTags) {
                    temp.add(techTag.getTechId());
                } 
            }
            // Ignore techniques with no tags.
            if (!temp.isEmpty()) {
                techTags.put(tagId, temp); 
            }
        }

        // Check if there doesn't exist any tags for techniques.
        if (techTags.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        // Return the final response
        return new ResponseEntity<>(techTags, HttpStatus.OK);
    }

    /**
     * Imports a mapping between techniques and tags into the database.
     * New techniques and relations between techniques and tags are added
     * as needed.
     * @param tagMap A list containing mappings between technique ids and
     *               tag names.
     * @return Http status.
     */
    @PostMapping("/import/techniques")
    public ResponseEntity postImport(@RequestBody List<TechniqueTagMap> tagMap) {
        for (TechniqueTagMap tagMapping:tagMap) {
            for (Tag tag:tagMapping.getTags()) {
                Tag tagInDatabase = null;
                try {
                    tagInDatabase = tagRepository.save(tag);
                } catch (Exception e) {
                    tagInDatabase = tagRepository.getTagByName(tag.getName());
                }
                TechniqueTag techniqueTag = new TechniqueTag();
                techniqueTag.setTechId(tagMapping.getTechId());
                techniqueTag.setTag(tagInDatabase);
                if (techniqueTagRepository.findByTechIdAndTagId(techniqueTag.getTechId(), techniqueTag.getTag()) == null)
                {
                    techniqueTagRepository.save(techniqueTag);
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Fetches a list of tags associated with the list of technique ids
     * taken as a parameter.
     * @param techIds technique ids for which tags will be fetched.
     * @return Http response with the fetched tags.
     */
    @GetMapping("/export/techniques")
    public ResponseEntity getExport(@RequestParam(name = "techniqueIds") List<Long> techIds) {
        List<List<String>> response = new ArrayList<>();
        for (Long id:techIds) {
            if (techniqueTagRepository.findByTechId(id) != null) {
                List<String> responsePart = new ArrayList<>();
                List<TechniqueTag> techniqueTags = techniqueTagRepository.findByTechId(id);
                for (TechniqueTag techniqueTag:techniqueTags) {
                    responsePart.add(techniqueTag.getTagObject().getName());
                }
                response.add(responsePart);
            }
            else {
                System.out.println("Technique does not exist");
            }
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
