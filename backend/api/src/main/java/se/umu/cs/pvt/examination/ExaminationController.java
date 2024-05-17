package se.umu.cs.pvt.examination;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.belt.BeltRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Class for handling requests to the examination api.
 * 
 * @author Team Pomegranate (c21man && ens20lpn)
 * @author Team Orange (dv22rfg)
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
    private ExaminationCommentRepository examinationCommentRepository;
    private ExaminationResultRepository examinationResultRepository;
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
     * @param examinationCommentRepository Repository for the examination comment entity.
     * @param examinationResultRepository Repository for the examination result entity.
     */
    @Autowired
    public ExaminationController(GradingRepository gradingRepository, BeltRepository beltRepository, ExamineePairRepository examineePairRepository, 
    ExamineeRepository examineeRepository, ExaminationCommentRepository examinationCommentRepository,  
    ExaminationResultRepository examinationResultRepository, ExaminationProtocolRepository examinationProtocolRepository) {
        this.gradingRepository = gradingRepository;
        this.beltRepository = beltRepository;
        this.examineePairRepository = examineePairRepository;
        this.examineeRepository = examineeRepository;
        this.examinationCommentRepository = examinationCommentRepository;
        this.examinationResultRepository = examinationResultRepository;
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
     * Returns a grading with a given grading id.
     * @param grading_id Given grading id.
     * @return The grading with the given grading id.
     */
    @GetMapping("/grading/{grading_id}")
    public ResponseEntity<Grading> getGrading(@PathVariable("grading_id") long grading_id) {
        Optional<Grading> grading = gradingRepository.findById(grading_id);
        if(grading.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(grading.get(), HttpStatus.OK);
    }

    /**
     * Returns the gradings that a specific user has created.
     * @param creator_id
     * @return The gradings that a specific user has created.
     * @return HTTP-status code.
     */
    @GetMapping("/grading/creator/{creator_id}")
    public ResponseEntity<List<Grading>> getGradingByCreator(@PathVariable("creator_id") long creator_id) {
        List<Grading> gradingByCreator = gradingRepository.findByCreatorId(creator_id);
        if(gradingByCreator.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(gradingByCreator, HttpStatus.OK);
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
     * Retrieves a list with all pairs with matching grading ID.
     * @param grading_id Object mapped examinee pair from request body.
     * @return HTTP-status code.
    */
    @GetMapping("/pair/grading/{grading_id}")
    public ResponseEntity<List<Map<String, Object>>> getPairsByGradingId(@PathVariable("grading_id") long grading_id) {
        List<ExamineePair> pairs = examineePairRepository.findAll();
        List<Map<String, Object>> pairsByGradingId = new ArrayList<>();

        for (ExamineePair p : pairs) {
            Optional<Examinee> examinee1 = examineeRepository.findById(p.getExaminee_1_id());
            
            if (examinee1.isPresent() && examinee1.get().getGrading_id() == grading_id) {
                Map<String, Object> pairMap = new HashMap<>();
                pairMap.put("pair_id", p.getExaminee_pair_id());
                Map<String, Object> examinee1Map = new HashMap<>();
                examinee1Map.put("id", examinee1.get().getExaminee_id());
                examinee1Map.put("name", examinee1.get().getName());
                
                pairMap.put("examinee_1", examinee1Map);
                if(p.getExaminee_2_id() != null) {
                    Optional<Examinee> examinee2 = examineeRepository.findById(p.getExaminee_2_id());
                    if (examinee2.isPresent()) {
                        Map<String, Object> examinee2Map = new HashMap<>();
                        examinee2Map.put("id", examinee2.get().getExaminee_id());
                        examinee2Map.put("name", examinee2.get().getName());
                        pairMap.put("examinee_2", examinee2Map);
                    }
                }else {
                    pairMap.put("examinee_2", null);
                }
                pairsByGradingId.add(pairMap);
            }
        }
        if (pairsByGradingId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(pairsByGradingId, HttpStatus.OK);
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

    /**
     * Returns a examinee with a given examinee id.
     * @param examinee_id
     * @return examinee with given examinee id.
     * @return HTTP-status code.  
     */
    @GetMapping("/examinee/{examinee_id}")
    public ResponseEntity<Examinee> getExaminee(@PathVariable("examinee_id") long examinee_id) {
        if(examineeRepository.findById(examinee_id).isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(examineeRepository.findById(examinee_id).get(), HttpStatus.OK);
    }

    /**
     * Creates an examination comment.
     * @param examination_comment Object mapped examination comment from request body.
     * @return The created examination comment
     * @return HTTP-status code.
     */
    @PostMapping("/comment")
    public ResponseEntity<ExaminationComment> createExaminationComment(@RequestBody ExaminationComment examination_comment){
        if(gradingRepository.findById(examination_comment.getGradingId()).isEmpty() || examination_comment == null){
            System.out.println("Grading not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        if(examineeRepository.findById(examination_comment.getExamineeId()).isEmpty() || examination_comment == null){
            System.out.println("Examinee not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ExaminationComment savedComment = examinationCommentRepository.save(examination_comment);
        return new ResponseEntity<>(savedComment, HttpStatus.OK);
    }
    
    /**
     * Updates an examination comment.
     * @param examination_comment Object mapped examination comment from request body.
     * @return HTTP-status code.
     */
    @PutMapping("/comment")
    public ResponseEntity<ExaminationComment> updateExaminationComment(@RequestBody ExaminationComment examination_comment){

        if(examinationCommentRepository.findById(examination_comment.getCommentId()).isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examinationCommentRepository.save(examination_comment);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    /**
     * Deletes a examination comment
     * @param examination_comment_id Given examination comment id.
     * @return HTTP-status code.
     */
    @DeleteMapping("/comment/{examination_comment_id}")
    public ResponseEntity<ExaminationComment> deleteExaminationComment(@PathVariable("examination_comment_id")long examination_comment_id){

        if(examinationCommentRepository.findById(examination_comment_id).isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examinationCommentRepository.deleteById(examination_comment_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * Returns all examination comments.
     * @return All examination comments. 
     * @return HTTP-status code.
     */
    @GetMapping("/comment/all")
    public ResponseEntity<List<ExaminationComment>> getAllGradingComments(){

        return new ResponseEntity<>(examinationCommentRepository.findAll(), HttpStatus.OK);
    }
    /**
     * Creates a examination result.
     * @param examination_result Object mapped examimnation result from request body.
     * @return The created examination result.
     * @return HTTP-status code.
    */ 
    @PostMapping("/examresult")
    public ResponseEntity<ExaminationResult> createExaminationResult(@RequestBody ExaminationResult examination_result){
        ExaminationResult new_examination_result = examinationResultRepository.save(examination_result);
        return new ResponseEntity<>(new_examination_result, HttpStatus.OK);
    }
    
   /**
     * Updates a given examination result.
     * @param examination_result Object mapped examimnation result from request body.
     * @return HTTP-status code.
    */  
    @PutMapping("/examresult")
    public ResponseEntity<Object> updateExaminationResult(@RequestBody ExaminationResult examination_result){

        if(examinationResultRepository.findById(examination_result.getResult_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examinationResultRepository.save(examination_result);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    /**
     * Returns all examination results.
     * @return All examination results.  
     * @return HTTP-status code.
     */
    @GetMapping("/examresult/all")
    ResponseEntity<List<ExaminationResult>> getAllExaminationResults(){
        return new ResponseEntity<>(examinationResultRepository.findAll(), HttpStatus.OK);
    }

    /**
     * Deletes a given examination result.
     * @param result_id Given examinee id.
     * @return HTTP-status code.
    */
    @DeleteMapping("/examresult/{result_id}")
    public ResponseEntity<ExaminationResult> deleteExaminationResult(@PathVariable("result_id") Long result_id) {
        if(examinationResultRepository.findById(result_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examinationResultRepository.deleteById(result_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Returns a list of the result of all examinees on a given technique.
     * @param technique_name Given technique name.
     * @param grading_id Given grading id.
     */
    @GetMapping("/examresult/{technique_name}/{grading_id}")
    public ResponseEntity<List<Map<String, Object>>> getExaminationProtocol(@PathVariable("technique_name") String technique_name, @PathVariable("grading_id") long grading_id) {
        List<Examinee> examinees = examineeRepository.findByGradingId(grading_id);
        List<ExaminationResult> examinationResults = examinationResultRepository.findAll();
        List<Map<String, Object>> results = new ArrayList<>();
        for(Examinee e : examinees) {
            for(ExaminationResult er : examinationResults) {
                if(er.getExaminee_id() == e.getExaminee_id() && er.getTechnique_name().equals(technique_name)) {
                    Map<String, Object> result = new HashMap<>();
                    result.put("examinee_id", e.getExaminee_id());
                    result.put("result", er.getPass());
                    results.add(result);
                }
            }
        }
        if(results.isEmpty()) {
            return new ResponseEntity<>(results, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(results, HttpStatus.OK);
    }   

    /**
     * Returns a list of the result of all techniques for a given examinee.
     * @param examinee Given technique name.
     */
    @GetMapping("/examresult/{examinee_id}")
    public ResponseEntity<List<ExaminationResult>>  getExaminationProtocolByExaminee(@PathVariable("examinee_id") long examinee_id) {
        List<ExaminationResult> examinationResults = examinationResultRepository.findAll();
        ArrayList<ExaminationResult> matching_results = new ArrayList<>();
        for(ExaminationResult er : examinationResults) {
            if(er.getExaminee_id() == examinee_id) {
                matching_results.add(er);
            }
        }
        return new ResponseEntity<>(matching_results, HttpStatus.OK);
    }

    /**
     * Returns all examination protocols.
     * @return All examination protocols.  
     * @return HTTP-status code.
     */
    @GetMapping("/examinationprotocol/all")
    public ResponseEntity<List<ExaminationProtocol>> getAllExaminationProtocol() {
        return new ResponseEntity<>(examinationProtocolRepository.findAll(), HttpStatus.OK);
    }
}
