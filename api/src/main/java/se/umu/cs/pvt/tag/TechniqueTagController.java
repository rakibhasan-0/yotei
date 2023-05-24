/**
 * The controller for the TechniqueTag entities.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
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
     *
     * @param toAddTechniqueTag The TechniqueTag entity without tagId.
     * @param tagId             The ID of the specified tag.
     * @return HTTP response
     * A response entity containing the added Technique/Tag pair with status OK.
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
     * Finds all Technique IDs that has a given Tag on it.
     *
     * @param id The tag Id of the specified tag.
     * @return HTTP response
     * A response entity with the list of Technique ids with status OK.
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
     *
     * @param toAddTechniqueTag The TechniqueTag entity without tagId.
     * @param tagId             The Id of the specified tag.
     * @return HTTP response
     * OK if the Technique Tag pair has been successfully deleted.
     * BAD_REQUEST if the pair could not be found.
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
     * Gets the Tags related to a Technique.
     *
     * @param techId The Technique ID.
     * @return HTTP response
     * A response entity with the list of IDs and status OK
     * BAD_REQUEST if Exercise has no Tags.
     */
    @GetMapping("/get/tag/by-technique")
    public ResponseEntity<List<TagResponse>> getTagByTechnique(@RequestParam(name = "techId") Long techId) {
        if (techniqueTagRepository.findByTechId(techId) != null) {
            return new ResponseEntity<>(
                    techniqueTagRepository.findAllProjectedByTechId(techId).stream()
                            .map(t -> new TagResponse(t.getTag().getId(), t.getTag().getName()))
                            .toList(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Gets all TechniqueIds mapped by their Tags.
     *
     * @return HTTP response
     * OK if a non-empty body is returned.
     * NO_CONTENT if there doesn't exist any tags for Techniques.
     * BAD_REQUEST for faulty requests.
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
}
