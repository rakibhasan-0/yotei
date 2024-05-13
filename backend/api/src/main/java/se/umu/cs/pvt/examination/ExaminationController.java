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
    private ExaminationProtocolRepository examinationProtocolRepository;

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
    ExamineeRepository examineeRepository, ExaminationProtocolRepository examinationProtocolRepository) {

        this.gradingRepository = gradingRepository;
        this.beltRepository = beltRepository;
        this.examineePairRepository = examineePairRepository;
        this.examineeRepository = examineeRepository;
        this.examinationProtocolRepository = examinationProtocolRepository;
    }

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    public ExaminationController() {}

    /**
     * Returns a list of all gradings.
     * @return All of the created gradings.
     * @return HTTP-status code.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Grading>> getAll() {
        return new ResponseEntity<>(gradingRepository.findAll(), HttpStatus.OK);
    }
    
    /**
     * Creates a grading.
     * @param grading Given grading id.
     * @return The created grading.
     * @return HTTP-status code.
     */
    @PostMapping("/grading")
    public ResponseEntity<Grading> createGrading(@RequestBody Grading grading) {
        if(beltRepository.findById(grading.getBelt_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Grading new_grading = gradingRepository.save(grading);
        return new ResponseEntity<>(new_grading, HttpStatus.OK);
    }
    
    /**
     * Deletes a given grading.
     * @param grading_id Given grading id.
     * @return HTTP-status code.
    */
    @DeleteMapping("/grading/{grading_id}")
    public ResponseEntity<Grading> deleteGrading(@PathVariable("grading_id") long grading_id) {
        if(gradingRepository.findById(grading_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        gradingRepository.deleteById(grading_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    /**
     * Updates a given grading.
     * @param grading Object mapped grading from request body.
     * @return HTTP-status code.
    */
    @PutMapping("/grading")
    public ResponseEntity<Object> updateSessionReview( @RequestBody Grading grading) {
        if(gradingRepository.findById(grading.getGrading_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        gradingRepository.save(grading);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    /**
     * Creates a examinee.
     * @param examinee Object mapped examinee from request body.
     * @return The created examinee.
     * @return HTTP-status code.
    */
    @PostMapping("/examinee")
    public ResponseEntity<Examinee> create(@RequestBody Examinee examinee) {
        if(gradingRepository.findById(examinee.getGrading_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Examinee new_examinee = examineeRepository.save(examinee);
        return new ResponseEntity<>(new_examinee, HttpStatus.OK);
    }
    
    /**
     * Delets a given examinee.
     * @param examinee_id Given examinee id.
     * @return HTTP-status code.
    */
    @DeleteMapping("/examinee/{examinee_id}")
    public ResponseEntity<Examinee> deleteExaminee(@PathVariable("examinee_id") long examinee_id) {
        if(examineeRepository.findById(examinee_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examineeRepository.deleteById(examinee_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Updates a given examinee.
     * @param examinee Object mapped examinee from request body.
     * @return HTTP-status code.
    */
    @PutMapping("/examinee")
    public ResponseEntity<Object> updateExaminee( @RequestBody Examinee examinee) {
        if(examineeRepository.findById(examinee.getExaminee_id()).isEmpty() || gradingRepository.findById(examinee.getGrading_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examineeRepository.save(examinee);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    /**
     * Creates a examinee pair.
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
     * @param examinee_pair_id Given examinee pair id.
     * @return HTTP-status code.
     */
    @DeleteMapping("/pair/{examinee_pair_id}")
    public ResponseEntity<ExamineePair> deleteExamineePair(@PathVariable("examinee_pair_id") long examinee_pair_id) {
        if(examineePairRepository.findById(examinee_pair_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examineePairRepository.deleteById(examinee_pair_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Returns all examinee pairs.
     * @return All examinee pairs.  
     * @return HTTP-status code.
     */
    @GetMapping("/pair/all")
    public ResponseEntity<List<ExamineePair>> getAllExamineePairs() {
        return new ResponseEntity<>(examineePairRepository.findAll(), HttpStatus.OK);
    }
    
    /**
     * Returns all examinees.
     * @return All examinee pairs.  
     * @return HTTP-status code.
     */
    @GetMapping("/examinee/all")
    public ResponseEntity<List<Examinee>> getAllExaminees() {
        return new ResponseEntity<>(examineeRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("/examinationprotocol")
    public ResponseEntity<ExaminationProtocol> createExaminationProtocol(@RequestBody ExaminationProtocol examination_protocol) {
        ExaminationProtocol new_examination_protocol = examinationProtocolRepository.save(examination_protocol);
        return new ResponseEntity<>(new_examination_protocol, HttpStatus.OK);
    }

    @PutMapping("/examinationprotocol")
    public ResponseEntity<Object> updateExaminationProtocol(@RequestBody ExaminationProtocol examination_protocol) {

        if(gradingRepository.findById(examination_protocol.getBeltId()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ExaminationProtocol new_examination_protocol = examinationProtocolRepository.save(examination_protocol);
        return new ResponseEntity<>(new_examination_protocol, HttpStatus.OK);
    }

    @DeleteMapping("/examinationprotocol/{belt_id}")
    public ResponseEntity<Object> deleteExaminationProtocol(@PathVariable("belt_id") long belt_id) {

        if(gradingRepository.findById(belt_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examinationProtocolRepository.deleteById(belt_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/examinationprotocol/all")
    public ResponseEntity<List<ExaminationProtocol>> getAllExaminationProtocol() {
        return new ResponseEntity<>(examinationProtocolRepository.findAll(), HttpStatus.OK);
    }


}
