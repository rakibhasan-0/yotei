package se.umu.cs.pvt.techniqueapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Class to get, insert, update, and remove technique.
 *
 * @author Quattro Formaggio, Carlskrove, Hawaii (Doc: Griffin ens19amd)
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/techniques")
public class TechniqueController {

    private TechniqueRepository techniqueRepository;

    @Autowired
    public TechniqueController(TechniqueRepository techniqueRepository) {
        this.techniqueRepository = techniqueRepository;
    }

    /**
     * Returns all techniques in the database, or if null is found: a
     * NOT_FOUND HttpStatus.
     * @return all techniques or HttpStatus indicating no techniques found.
     */
    @GetMapping("/all")
    public Object getTechniques() {
        List<Technique> techniqueList = techniqueRepository.findAll();
        if (techniqueList == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return techniqueList;
    }

    /**
     * Returns the description of specified technique given an id.
     * @param id The id to query to the database.
     * @return Description for technique, or if technique could not be found:
     * response indicating error.
     */
    @GetMapping("/getdesc")
    public Object getDescription(@RequestParam Long id) {
        if (id == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        if (!techniqueRepository.existsById(id)) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

        return techniqueRepository.findById(id).get();
    }

    /**
     * Returns a technique depending on the id, or a HttpStatus indicating if
     * there is a bad request or no technique with id found.
     * @param id the id.
     * @return a technique, or HttpStatus indicating error.
     */
    @GetMapping("/{id}")
    public Object getTechniques(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        //return not found if no technique with given id could be found.
        if (!techniqueRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Technique technique = techniqueRepository.findById(id).get();
        return technique;
    }

    /**
     * Returns all techniques with only Id and Name.
     * @return all techniques with only Id and Name, or HttpStatus indicating.
     * techniques could not be found.
     */
    @GetMapping("/all/idname")
    public Object getTechniquesIdName() {
        List<TechniqueShort> techniqueList = techniqueRepository.findAllProjectedBy(TechniqueShort.class);

        if (techniqueList == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

        return techniqueList;
    }

    /**
     * This method adds an technique to the database.
     *
     * Returns 409 CONFLICT if given name is taken.
     * Returns 400 BAD REQUEST if technique does not have valid format.
     * Returns 200 OK if technique is posted.
     *
     * @param toAdd the body in json format with correct attributes example:
     *              {name: "cool_name", description: "cool_desc", duration: 2}
     * @return responseEntity indicating the success-status of the post.
     */
    @PostMapping("/add")
    public ResponseEntity<Object> postTechnique(@RequestBody Technique toAdd) {

        //remove leading and trailing whitespaces
        toAdd.trimText();

        // If the name is already in the database the technique will not be added.
        if (!techniqueRepository.findByNameIgnoreCase(toAdd.getName()).isEmpty()) {
            return new ResponseEntity<>(toAdd, HttpStatus.CONFLICT);
        }

        // If technique has invalid format it will not be added.
        if (!toAdd.validFormat()) {
            return new ResponseEntity<>("Fel format", HttpStatus.BAD_REQUEST);
        }
        
        // Otherwise the technique is added.
        try {
            techniqueRepository.save(toAdd);
        } catch (Exception e) {
            return new ResponseEntity<>("Kunde inte spara till databasen", HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity<>(toAdd, HttpStatus.OK);
    }

    /**
     * This method updates an existing technique to the database. Technique
     * must have a name.
     * @param toUpdate the body in json format with correct attributes example:
     *              {id: 1, name: "cool_name", description: "cool_desc", duration: 2}
     * @return HttpStatus indicating success or error.
     */
    @PutMapping("/update")
    public ResponseEntity<Object> updateTechnique(@RequestBody Technique toUpdate) {
        // Checks that entry exists in the database, exits with error if id is not found
        if (techniqueRepository.findById(toUpdate.getId()).isEmpty()) {
            return new ResponseEntity<>(toUpdate, HttpStatus.BAD_REQUEST);
        }

        // Technique will not be updated to wrong format
        if (!toUpdate.validFormat()) {
            return new ResponseEntity<>("Fel format", HttpStatus.BAD_REQUEST);
        }

        try {
            techniqueRepository.save(toUpdate);
        } catch (Exception e) {
            return new ResponseEntity<>("Kunde inte uppdatera teknik", HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity<>(toUpdate, HttpStatus.OK);
    }
    /**
     * Takes forwarded content from JSON file and saves it to the database
     * as individual JSON objects. Saves only those techniques that had valid
     * format.
     *
     * @param listImport The list of JSON objects.
     * @return response indicating if all techniques was added or if it was a
     * bad request.
     */
    @PostMapping("/import")
    public ResponseEntity postImport(@RequestBody List<Technique> listImport) {
        int duplicates = 0;
        int i = 0;
        List<Long> ids = new ArrayList<>();

        if (listImport == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        for (Technique technique : listImport) {
            i++;
            if(technique.validFormat()) {
                // Remove leading and trailing whitespace.
                technique.trimText();
                try {
                    ids.add(techniqueRepository.save(technique).getId());
                } catch (Exception e) {
                    // Technique duplicate found.
                    ids.add(techniqueRepository.findByName(technique.getName()).getId());
                    duplicates += 1;
                }
            }
            else {
                // Respond with wich numbers of techiques were found.
                return new ResponseEntity(new TechniqueImportResponse("Tekniker fram till " + i +  ".\"" + technique.getName() + "\" har importerats", ids), HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }

        // Respond with numbers of duplicate names found.
        if(duplicates > 0) {
            return new ResponseEntity(new TechniqueImportResponse(duplicates + " tekniker av samma namn existerar redan", ids), HttpStatus.CONFLICT);
        }

        return new ResponseEntity(new TechniqueImportResponse("", ids), HttpStatus.OK);
    }

    /**
     * This method removes an existing technique in the database. If the technique does not exist in the database a
     * BAD_REQUEST is returned.
     * @param id The Id of the technique to remove.
     * @return Returns OK if the technique exists in the database, else BAD_REQUEST.
     */
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<HttpStatus> removeTechnique(@PathVariable("id") Long id) {
        if (techniqueRepository.findById(id).orElse(null) == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Technique technique = techniqueRepository.findById(id).get();
        techniqueRepository.delete(technique);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
