package se.umu.cs.pvt.belt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for fetching belts.
 *
 * @author Max Thorén, André Byström, Squad 2 Griffins
 * date: 2023-04-24
 * @version 2.0
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/belts")
public class BeltController {

    private BeltRepository beltRepository;

    @Autowired
    public BeltController(BeltRepository beltRepository) {
        this.beltRepository = beltRepository;
    }

    /**
     * Returns all belts in the database. If belts were to be non existant in the
     * database the method returns a HttpStatus.NOT_FOUND response.
     * @deprecated The "/all" endpoint is to be removed.
     * @return A list of all the belts.
     */
    @GetMapping(value={"", "/all"})
    public ResponseEntity<Object> getBelts() {
        List<Belt> allBelts = beltRepository.findAll();

        if (allBelts.isEmpty()) {
            return new ResponseEntity<>("Hittade inga sparade bälten.", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(allBelts, HttpStatus.OK);
    }


    /**
     * Returns the belts with the corresponding IDs. If the ID is non existant in the
     * belt table the method returns a HttpStatus.NOT_FOUND response. Does not accept negative or null IDs.
     * 
     * @param ids A list of IDs of the colors to get.
     * @return A list of belts and a HttpStatus OK or a HttpStatus indicating an error if belts are non existent in the database.
     */
    @GetMapping(value = "", params = "id")
    public ResponseEntity<Object> getBelts(@RequestParam List<Long> id) {
        if (id == null) {
            return new ResponseEntity<Object>("Felaktigt id.", HttpStatus.NOT_FOUND);
        }

        for (Long cur: id) {
            if (cur == null || cur < 0) {
                return new ResponseEntity<Object>("Felaktigt id.", HttpStatus.NOT_FOUND);
            }
        }

        List<Belt> belts = beltRepository.findAllById(id);

        /* Either returns all data or none if some ID is incorrect. */
        if (belts.isEmpty() || belts.size() != id.size()) {
            return new ResponseEntity<Object>("Kunde ej hitta bälte.", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Object>(belts, HttpStatus.OK);
    }
}
