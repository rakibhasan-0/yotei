/**
 * The Tag API controller.
 * Class for managing tag API calls.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 * @Author Team 3 (Durian)
 * @since 2024-05-02
 */
package se.umu.cs.pvt.tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.query.EscapeCharacter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(path = "/api/tags")
public class TagController {
    @Autowired
    private final TagRepository tagRepository;

    /**
     * Contructor for the TagController object.
     *
     * @param tagRepository Autowired.
     */
    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * Returns all Tags from the database.
     *
     * @return All tags.
     * @deprecated the /all endpoint.
     */
    @GetMapping(value = { "", "/all" })
    public ResponseEntity<List<Tag>> getTags() {
        List<Tag> tags = tagRepository.findAll();
        if (tags.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(tags, HttpStatus.OK);
    }

    /**
     * Deletes a tag by id.
     *
     * @param id the id of the tag.
     * @return response, 200 OK on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTag(@PathVariable Long id) {
        // See if a tag with the given ID exists.
        if (tagRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>("Tag with ID: " + id + " does not exist", HttpStatus.BAD_REQUEST);
        }
        tagRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Removes a Tag with a given ID.
     *
     * @param id The IdD of the Tag to remove.
     * @see se.umu.cs.pvt.tag.TagController#deleteTag(Long)
     * @deprecated this entire endpoint.
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Object> removeTag(@RequestParam(name = "id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // See if a tag with the given ID exists.
        if (tagRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>("Tag with ID: " + id + " does not exist", HttpStatus.BAD_REQUEST);
        }
        tagRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Gets all tags sorted according to the sortBy parameter, and filtered according to contains.
     * 
     * @param sortBy The sort order. Can be one of "use-desc", "use-asc", "name-desc", "name-asc".
     * "use" is sorted according to the total number of exercises, techniques and workouts for which the tags are used.
     * "name" is sorted according to the tag name.
     * @param contains The (case insensitive) substring that must exist in the tag names.
     * @return The list of tags sorted and filtered tags.
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Tag>> filterTags(@RequestParam("sort-by") String sortBy, String contains) {
        if (sortBy == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        List<Tag> result;

        if (contains != null && !(contains = contains.trim()).isEmpty()) {
            result = switch (sortBy) {
                case "use-desc"  -> tagRepository.findAllByNameContainingIgnoreCaseOrderByUseDesc(EscapeCharacter.DEFAULT.escape(contains));
                case "use-asc"   -> tagRepository.findAllByNameContainingIgnoreCaseOrderByUseAsc (EscapeCharacter.DEFAULT.escape(contains));
                case "name-desc" -> tagRepository.findAllByNameContainingIgnoreCaseOrderByNameDesc(contains);
                case "name-asc"  -> tagRepository.findAllByNameContainingIgnoreCaseOrderByNameAsc (contains);
                default -> null;
            };
        }
        else {
            result = switch (sortBy) {
                case "use-desc"  -> tagRepository.getAllByOrderByUseDesc();
                case "use-asc"   -> tagRepository.getAllByOrderByUseAsc();
                case "name-desc" -> tagRepository.getAllByOrderByNameDesc();
                case "name-asc"  -> tagRepository.getAllByOrderByNameAsc();
                default -> null;
            };
        }

        if (result == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Gets how many times the tag is used by exercises, techniques and workouts.
     * 
     * @param tagId The id of the tag of interest.
     * @return {"exercises":x1,"techniques":x2,"workouts":x3}.
     * All values will be zero if the tag does not exist.
     */
    @GetMapping("/usage")
    public ResponseEntity<TagRepository.TagUsageStats> getTagUsage(@RequestParam("tag-id") long tagId) {
        return new ResponseEntity<>(tagRepository.getUsageStatsById(tagId), HttpStatus.OK);
    }

    /**
     * Adds a Tag.
     *
     * @param toAdd The Tag to add.
     * @return The newly added Tag.
     * @deprecated the /add endpoint.
     */
    @PostMapping(value = { "", "/add" })
    public ResponseEntity<Tag> postTag(@RequestBody Tag toAdd) {
        if (toAdd.getName().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        toAdd.nameToLowerCase();
        tagRepository.save(toAdd);
        return new ResponseEntity<>(tagRepository.getTagByName(toAdd.getName()), HttpStatus.CREATED);
    }

    /**
     * Edits a Tag.
     *
     * @param id         The tag to be updated/edited.
     * @param updatedTag The updated data.
     * @return ResponseEntity with the updated tag or an error message.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> updateTag(@PathVariable Long id, @RequestBody Tag updatedTag) {
        Optional<Tag> firstTag = tagRepository.findById(id);
        if (!firstTag.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Tag tagToUpdate = firstTag.get();
        tagToUpdate.setName(updatedTag.getName());
        tagToUpdate.nameToLowerCase();

        tagRepository.save(tagToUpdate);

        TagResponse response = new TagResponse(tagToUpdate.getId(), tagToUpdate.getName());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
