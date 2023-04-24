/**
 * The Tag API controller.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * Class for managing tag API calls.
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/tags")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    /**
     * Contructor for the TagController object.
     * @param tagRepository Autowired
     */
    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * Returns all tags from the database.
     * @return All tags.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Tag>> getTags() {
        List<Tag> tags = tagRepository.findAll();
        if (tags.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(tags, HttpStatus.OK);
    }

    /**
     * Removes a tag with a given Id.
     * @param id The Id of the tag to remove.
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Object> removeTag(@RequestParam(name = "id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // See if a tag with the given ID exists.
        if (tagRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>("Tag with ID: " + id + " does not exist",HttpStatus.BAD_REQUEST);
        }
        tagRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    /**
     * Adds a tag.
     * @param toAdd The tag to add.
     * @return The newly added tag.
     */
    @PostMapping("/add")
    public ResponseEntity<Tag> postTag(@RequestBody Tag toAdd) {
        if (toAdd.getName().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        tagRepository.save(toAdd);
        return new ResponseEntity<>(tagRepository.getTagByName(toAdd.getName()), HttpStatus.CREATED);
    }  
}
