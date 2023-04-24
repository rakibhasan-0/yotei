package se.umu.cs.pvt.belt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for fetching belts.
 *
 * @author Max Thorén
 * @author Andre Byström
 * date: 2023-04-24
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
     * Returns all belts in the database. Will never be null
     * because belts are only inserted at database initialization
     * and are never removed.
     * @return A list of all the belts.
     */
    @GetMapping("/all")
    public List<Belt> getBelts() {
        return beltRepository.findAll();
    }
}
