package se.umu.cs.pvt.technique;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Class to get, insert, update, and remove technique.
 *
 * Original by:
 * @author Quattro Formaggio, Carlskrove, Hawaii (Doc: Griffin ens19amd)
 *
 * Updated by:
 * @author Medusa
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
    @GetMapping("")
    public ResponseEntity<Object> getTechniques() {
        List<Technique> allTechniques = techniqueRepository.findAll();

        if (allTechniques.isEmpty()) {
            return new ResponseEntity<>("Hittade inga sparade tekniker", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(allTechniques, HttpStatus.OK);
    }

    /**
     * Returns a technique depending on the id, or a HttpStatus indicating if
     * there is a bad request or no technique with id found.
     * @param id the id.
     * @return a technique, or HttpStatus indicating error.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTechniques(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>("Inget ID angavs", HttpStatus.BAD_REQUEST);
        }

        if (id < 0) {
            return new ResponseEntity<>("ID på tekniker kan inte vara negativa", HttpStatus.BAD_REQUEST);
        }

        if (!techniqueRepository.existsById(id)) {
            return new ResponseEntity<>("Hittade ingen teknik med id: " + id, HttpStatus.NOT_FOUND);
        }

        Technique technique = techniqueRepository.findById(id).get();
        return new ResponseEntity<>(technique, HttpStatus.OK);
    }

    /**
     * This method adds a technique to the database.
     *
     * Returns 201 CREATED if the technique is posted.
     * Returns 409 CONFLICT if the given name is taken.
     * Returns 409 NOT ACCEPTABLE if the given name is in a illegal format. (Too short or too long).
     * Returns 500 INTERNAL SERVER ERROR if an error occurs during the database transaction.
     *
     * @param toAdd the body in json format with correct attributes
     * Example:
     * {
     *     name: "cool_name",
     *     description: "cool_desc",
     *     belts: [{
     *         id: 1
     *     ]},
     *     tags: [{
     *         id: 1
     *     ]}
     * }
     *
     * @return responseEntity indicating the success-status of the post.
     */
    @PostMapping("")
    public ResponseEntity<Object> postTechnique(@RequestBody Technique toAdd) {
        toAdd.trimText();

        if (!techniqueRepository.findByNameIgnoreCase(toAdd.getName()).isEmpty()) {
            return new ResponseEntity<>("Tekniken med namnet '" + toAdd.getName() + "' finns redan", HttpStatus.CONFLICT);
        }

        if (!toAdd.validFormat()) {
            return new ResponseEntity<>("Fel format: Namn på teknik saknas eller är för långt.", HttpStatus.NOT_ACCEPTABLE);
        }
        
        try {
            return new ResponseEntity<>(techniqueRepository.save(toAdd), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Internt fel: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * This method updates an existing technique to the database. Technique
     * must have a name.
     * Omitting an attribute will null it. This is used to, for example, remove a tag.
     * @param toUpdate the body in json format with correct attributes example:
     * {
     *     id: 1,
     *     name: "new cool_name",
     *     description: "cool_desc",
     *     belts: [{
     *         id: 1
     *     ]},
     *     tags: [{
     *         id: 1
     *     ]}
     * }
     * @return HttpStatus indicating success or error.
     */
    @PutMapping("")
    public ResponseEntity<Object> updateTechnique(@RequestBody Technique toUpdate) {
        Long id = toUpdate.getId();
        if (techniqueRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>("Teknik med id " + id + " hittades inte", HttpStatus.NOT_FOUND);
        }

        if (!techniqueRepository.findByNameIgnoreCase(toUpdate.getName()).isEmpty()) {
            return new ResponseEntity<>("Tekniken med namnet '" + toUpdate.getName() + "' finns redan", HttpStatus.CONFLICT);
        }

        if (!toUpdate.validFormat()) {
            return new ResponseEntity<>("Fel format: Namn på teknik saknas eller är för långt", HttpStatus.NOT_ACCEPTABLE);
        }

        // A technique can't be updated if description is null, since its column is NOT NULL in the database.
        if (toUpdate.getDescription() == null) {
            toUpdate.setDescription("");
        }

        try {
            return new ResponseEntity<>(techniqueRepository.save(toUpdate), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Internt fel: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public ResponseEntity<TechniqueImportResponse> postImport(@RequestBody List<Technique> listImport) {
        if (listImport == null) {
            TechniqueImportResponse resp = new TechniqueImportResponse("Inga tekniker listade", null);
            return new ResponseEntity<>(resp, HttpStatus.BAD_REQUEST);
        }

        // The ids of the successfully added techniques.
        List<Long> ids = new ArrayList<>();
        boolean hasError = false;
        int duplicates = 0;
        int nrOfInvalidFormat = 0;

        for (Technique technique : listImport) {
            technique.trimText();

            if (!technique.validFormat()) {
                nrOfInvalidFormat++;
                continue;
            }

            if (!techniqueRepository.findByNameIgnoreCase(technique.getName()).isEmpty()) {
                duplicates++;
                continue;
            }

            try {
                ids.add(techniqueRepository.save(technique).getId());
            } catch (Exception e) {
                hasError = true;
            }

        }

        if (nrOfInvalidFormat > 0) {
            return new ResponseEntity<>(new TechniqueImportResponse(nrOfInvalidFormat + " tekniker har ogiltigt format (ej angivna namn / för långa namn) och lades ej till.", ids), HttpStatus.NOT_ACCEPTABLE);
        }

        if (duplicates > 0) {
            return new ResponseEntity<>(new TechniqueImportResponse(duplicates + " tekniker av samma namn existerar redan och lades ej till.", ids), HttpStatus.CONFLICT);
        }

        if (hasError) {
            return new ResponseEntity<>(new TechniqueImportResponse("Lyckades inte spara alla tekniker till databasen.", ids), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(new TechniqueImportResponse("Lade till tekniker", ids), HttpStatus.CREATED);
    }

    /**
     * This method removes an existing technique in the database. If the technique does not exist in the database a
     * BAD_REQUEST is returned.
     * @param id The Id of the technique to remove.
     * @return Returns OK if the technique exists in the database, else BAD_REQUEST.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> removeTechnique(@PathVariable("id") Long id) {
        if (techniqueRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>("Ingen teknik med ID " + id + " hittades", HttpStatus.NOT_FOUND);
        }

        Technique technique = techniqueRepository.findById(id).get();
        techniqueRepository.delete(technique);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
