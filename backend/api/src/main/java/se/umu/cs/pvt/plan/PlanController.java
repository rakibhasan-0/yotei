package se.umu.cs.pvt.plan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Plan API for creating, reading, updating and deleting plans.
 *
 * @author Calzone (Doc:Griffin c20wnn)
 */

@RestController
@CrossOrigin
@RequestMapping(path = "/api/plan")
public class PlanController {
    private final PlanRepository planRepository;

    /**
     * Constructor for plan controller
     * @param planRepository plan repository extending a JPA repository
     */
    @Autowired
    public PlanController(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    /**
     * Adds a Plan to the database. Date should be a long int in unix format, i.e.
     * 1651821130 is 06/05/2022 09:12:30
     *
     * @param toAdd the body in json format with correct attributes example:
     *                {"name": "test", "color": "#FFFFFF","startDate": "2020-03-24","endDate": "2022-04-24","userId": 1}
     * @return HTTP response status:
     *         * 400: The plan to be added contains null attributes
     *         * 201: The plan was added to the database successfully
     *
     */
    @PostMapping("/add")
    public ResponseEntity<Plan> postPlan(@RequestBody Plan toAdd) {

        if (toAdd.hasNullAttributes() || toAdd.nameIsEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (this.planRepository.findByName(toAdd.getName()) != null) {
            //checks if plan to add already exists.
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        planRepository.save(toAdd);
        return new ResponseEntity<>(toAdd, HttpStatus.CREATED);
    }

    /**
     * Removes an entity from database which has the id that is given
     * Example call: /remove?id=1
     *
     * @param id id of plan to be removed
     * @return HTTP response status:
     *         * 404: the provided id does not correspond to an entry in the database
     *         * 200: The provided plan was removed successfully
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removePlan(@RequestParam("id") Long id) {

        if(planRepository.findById(id).isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Plan plan = planRepository.findById(id).get();
        planRepository.delete(plan);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * This method updates an existing plan to the database.
     * @param toUpdate the body in json format with correct attributes example:
     *       {
     *          "id":1,
     *          "name":"updated plan",
     *          "startDate":"2020-03-23",
     *          "endDate":"2022-04-23",
     *          "userId":1,
     *          belts[{
     *              belt_id:1
     *          }]
     * }
     * @return HTTP response status:
     *         * 400: The updated plan provided is not valid
     *         * 404: The plan to be updated is not stored in the database
     *         * 200: The plan was updated successfully
     */
    @PutMapping("/update")
    public ResponseEntity<Plan> updatePlan(@RequestBody Plan toUpdate) {

        // Abort if the provided plan is invalid
        if(toUpdate.hasNullAttributes() || (toUpdate.getId() == null) || toUpdate.nameIsEmpty()) {
            return new ResponseEntity<>(toUpdate, HttpStatus.BAD_REQUEST);
        }

        // Abort if the plan to be updated is not stored in the database
        if (planRepository.findById(toUpdate.getId()).isEmpty()) {
            return new ResponseEntity<>(toUpdate, HttpStatus.NOT_FOUND);
        }

        planRepository.save(toUpdate);
        return new ResponseEntity<>(toUpdate, HttpStatus.OK);
    }

    /**
     * Returns all plans from the database, or if no plans are present, the 404 HTTP status is returned.
     * @return HTTP response status:
     *         * 404: No plans exist in the database
     *         * 200: A list of all plans is returned
     */
    @GetMapping("/all")
    public ResponseEntity<List<Plan>> getAllPlan() {

        List<Plan> planList = planRepository.findAll();

        if(planList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(planList, HttpStatus.OK);
    }

}
