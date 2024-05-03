package se.umu.cs.pvt.examination;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.belt.BeltRepository;

import java.util.List;
import java.util.Optional;

/**
 * Class for handling requests to the examination api.
 * 
 * @author Pomegranate (c21man && ens20lpn)
 */
@RestController
@RequestMapping(path = "/api/examination")
public class ExaminationController {

    /*
     * The repositories for the different entities.
     */
    private GradingRepository gradingRepository;
    private BeltRepository beltRepository;
    private ExamineePairRepository examineePairRepository;
    private ExamineeRepository examineeRepository;

    public ResponseEntity<String> example() {
        return new ResponseEntity<>("hello", HttpStatus.OK);
    }
    
    /**
     * Data constructor for ExaminationController.
     * 
     * @param gradingRepository Repository for the grading entity.
     * @param beltRepository Repository for the belt entity.
     * @param examineePairRepository Repository for the examinee pair entity.
     * @param examineeRepository Repository for the examinee entity.
     */
    @Autowired
    public ExaminationController(GradingRepository gradingRepository, BeltRepository beltRepository, ExamineePairRepository examineePairRepository, 
    ExamineeRepository examineeRepository) {
        this.gradingRepository = gradingRepository;
        this.beltRepository = beltRepository;
        this.examineePairRepository = examineePairRepository;
        this.examineeRepository = examineeRepository;
    }

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    public ExaminationController() {}


    @GetMapping("/all")
    public ResponseEntity<List<Grading>> getAll() {
        return new ResponseEntity<>(gradingRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("/grading")
    public ResponseEntity<Grading> createGrading(@RequestBody Grading grading) {
        if(beltRepository.findById(grading.getBelt_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Grading new_grading = gradingRepository.save(grading);
        return new ResponseEntity<>(new_grading, HttpStatus.OK);
    }

    @DeleteMapping("/grading/{grading_id}")
    public ResponseEntity<Grading> deleteGrading(@PathVariable("grading_id") long grading_id) {
        if(gradingRepository.findById(grading_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        gradingRepository.deleteById(grading_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PutMapping("/grading")
    public ResponseEntity<Object> updateSessionReview( @RequestBody Grading grading) {
        if(gradingRepository.findById(grading.getGrading_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        gradingRepository.save(grading);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping("/examinee")
    public ResponseEntity<Examinee> create(@RequestBody Examinee examinee) {
        if(gradingRepository.findById(examinee.getGrading_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Examinee new_examinee = examineeRepository.save(examinee);
        return new ResponseEntity<>(new_examinee, HttpStatus.OK);
    }
    
    @DeleteMapping("/examinee/{examinee_id}")
    public ResponseEntity<Examinee> deleteExaminee(@PathVariable("examinee_id") long examinee_id) {
        if(examineeRepository.findById(examinee_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examineeRepository.deleteById(examinee_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    

    @PutMapping("/examinee")
    public ResponseEntity<Object> updateExaminee( @RequestBody Examinee examinee) {
        if(examineeRepository.findById(examinee.getExaminee_id()).isEmpty() || gradingRepository.findById(examinee.getGrading_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examineeRepository.save(examinee);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    /**
     * creates a examinee pair.
     * @param examinee_pair Object mapped examinee pair from request body.
     * @return The created examinee pair.
     * @return HTTP-status code.
    */
    @PostMapping("/pair")
    public ResponseEntity<ExamineePair> createExamineePair(@RequestBody ExamineePair examinee_pair) {
        ExamineePair new_examinee_pair = examineePairRepository.save(examinee_pair);
        return new ResponseEntity<>(new_examinee_pair, HttpStatus.OK);
    }
    
    /**
     * Deletes a examinee pair.
     * @param examinee_pair Object mapped examinee pair from request body.
     * @return HTTP-status code.
     */
    @DeleteMapping("/pair")
    public ResponseEntity<ExamineePair> deleteExamineePair(@RequestBody ExamineePair examinee_pair) {
        if(examineePairRepository.findById(examinee_pair.getExaminee_pair_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examineePairRepository.deleteById(examinee_pair.getExaminee_pair_id());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Update a session review.
     * 
     * @return All examinees.  
     * @return HTTP-status code.
     */
    @GetMapping("/pair/all")
    public ResponseEntity<List<ExamineePair>> getAllExamineePairs() {
        return new ResponseEntity<>(examineePairRepository.findAll(), HttpStatus.OK);
    }
    
    /**
     * Update a session review.
     * 
     * @param review_id The session review id.
     * @param session Object mapped session review from request body.
     * @return HTTP-status code.
     */
    @GetMapping("/examinee/all")
    public ResponseEntity<List<Examinee>> getAllExaminees() {
        return new ResponseEntity<>(examineeRepository.findAll(), HttpStatus.OK);
    }
}
