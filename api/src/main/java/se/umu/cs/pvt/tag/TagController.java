/**
 * The Tag API controller.
 * Class for managing tag API calls.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
     * @param   tagRepository   Autowired.
     */
    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }


    /**
     * Returns all Tags from the database.
     *
     * @return      All tags.
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
     * Removes a Tag with a given ID.
     *
     * @param   id      The IdD of the Tag to remove.
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
     * Adds a Tag.
     *
     * @param   toAdd       The Tag to add.
     * @return              The newly added Tag.
     */
    @PostMapping("/add")
    public ResponseEntity<Tag> postTag(@RequestBody Tag toAdd) {
        if (toAdd.getName().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
		
		toAdd.nameToLowerCase();
        tagRepository.save(toAdd);
        return new ResponseEntity<>(tagRepository.getTagByName(toAdd.getName()), HttpStatus.CREATED);
    }  
}
