package se.umu.cs.pvt.examination;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.JsonObjectSerializer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.belt.BeltRepository;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Base64;

/**
 * Class for handling requests to the examination api.
 * 
 * @author Team Pomegranate (c21man && ens20lpn)
 * @author Team Orange (dv22rfg && c19jen)
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
        
        // if(beltRepository.findById(grading.getBelt_id()).isEmpty()) {
        //     return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        // }
        System.out.println(grading.getCreatorI
        System.out.println(grading.getBeltId());
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
        if(gradingRepository.findById(grading.getGradingId()).isEmpty()) {
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
        if(gradingRepository.findById(examinee.getGradingId()).isEmpty()) {
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
        if(examineeRepository.findById(examinee.getExamineeId()).isEmpty() || gradingRepository.findById(examinee.getGradingId()).isEmpty()) {
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
            Optional<Examinee> examinee1 = examineeRepository.findById(p.getExaminee1Id());
            
            if (examinee1.isPresent() && examinee1.get().getGradingId() == grading_id) {
                Map<String, Object> pairMap = new HashMap<>();
                pairMap.put("pair_id", p.getExamineePairId());
                Map<String, Object> examinee1Map = new HashMap<>();
                examinee1Map.put("id", examinee1.get().getExamineeId());
                examinee1Map.put("name", examinee1.get().getName());
                
                pairMap.put("examinee_1", examinee1Map);
                if(p.getExaminee2Id() != null) {
                    Optional<Examinee> examinee2 = examineeRepository.findById(p.getExaminee2Id());
                    if (examinee2.isPresent()) {
                        Map<String, Object> examinee2Map = new HashMap<>();
                        examinee2Map.put("id", examinee2.get().getExamineeId());
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
    
        if(examination_comment.getExamineeId() != null && examineeRepository.findById(examination_comment.getExamineeId()).isEmpty() || examination_comment == null){
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
     * Returns a group comment based on grading id and technique name.
     * @param gradingId the gradingId of sought grading.
     * @param techniqueName the technique name of sought technique.
     * @return all the comments on a group based on grading id and technique name and Examinee Id and Pair Id is null.
     */
    @GetMapping("/comment/group/{grading_id}")
    public ResponseEntity<List<ExaminationComment>> getGradingComment(@PathVariable("grading_id") long gradingId, @RequestParam(name = "technique_name") String techniqueName ) {
        try {
            if (techniqueName == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } if (examinationCommentRepository.findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(gradingId, techniqueName).isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(examinationCommentRepository.findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(gradingId, techniqueName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
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
     * Returns a specific comment based on examinee_id and techniqueName.
     * @param examinee_id examineeId of the desired examinee.
     * @param techniqueName techniqueName of the desired technique.
     * @return HTTP-status code.
     */
    @GetMapping("/comment/examinee/{examinee_id}")
    public ResponseEntity<List<ExaminationComment>> getExamineeComment(@PathVariable("examinee_id") long examinee_id, @RequestParam(name = "technique_name") String techniqueName ) {
        try {
            if (techniqueName == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } if (examinationCommentRepository.findByExamineeIdAndTechniqueName(examinee_id, techniqueName).isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(examinationCommentRepository.findByExamineeIdAndTechniqueName(examinee_id, techniqueName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Returns a list of comments based on examinee_id.
     * @param examinee_id
     * @return List of comments based on examinee_id.
     */
    @GetMapping("/comment/examinee/all/{examinee_id}")
    public ResponseEntity<List<ExaminationComment>> getExamineeComments(@PathVariable("examinee_id") long examinee_id) {
        List<ExaminationComment> comments = examinationCommentRepository.findByExamineeId(examinee_id);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    /**
     * Returns a list of comments based on examinee_pair_id.
     * @param examineePairId
     * @return List of comments based on examinee_pair_id
     */
    @GetMapping("/comment/pair/all/{examinee_pair_id}")
    public ResponseEntity<List<ExaminationComment>> getExamineePairComments(@PathVariable("examinee_pair_id") long examineePairId) {
        List<ExaminationComment> comments = examinationCommentRepository.findByExamineePairId(examineePairId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    /**
     * Returns a list of group comments based on grading_id.
     * @param grading_id
     * @return List of group comments based on grading_id.
     */
    @GetMapping("/comment/group/all/{grading_id}")
    public ResponseEntity<List<ExaminationComment>> getGradingComments(@PathVariable("grading_id") long grading_id) {
        List<ExaminationComment> comments = examinationCommentRepository.findByGradingIdAndExamineeIdIsNullAndExamineePairIdIsNull(grading_id);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    /**
     * Returns a specific comment based on examinee_pair_id and techniqueName.
     * @param examineePairId examinee pair id of the desired examinee pair.
     * @param techniqueName techniqueName of the desired technique.
     * @return HTTP-status code.
     */
    @GetMapping("/comment/pair/{examinee_pair_id}")
    public ResponseEntity<List<ExaminationComment>> getExamineePairComment(@PathVariable("examinee_pair_id") long examineePairId, @RequestParam(name = "technique_name") String techniqueName ) {
        try {
            if (techniqueName == null) {
                return new ResponseEntity<>(null);
            }
             if (examinationCommentRepository.findByExamineePairIdAndTechniqueName(examineePairId, techniqueName).isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(examinationCommentRepository.findByExamineePairIdAndTechniqueName(examineePairId, techniqueName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }   
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

        if(examinationResultRepository.findById(examination_result.getResultId()).isEmpty()) {
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
     * Returns a specific examination result based on grading_id. The return is a map of examinees and the number of techniques 
     * they have passed and in addition, a total count of techniques for the entire examination.
     * @param grading_id
     * @return
     */
    @GetMapping("/examresult/grading/{grading_id}")
    public ResponseEntity<Map<String, Object>> getExaminationResultByGradingId(@PathVariable("grading_id") long grading_id){
        List<Examinee> examinees = examineeRepository.findByGradingId(grading_id);
        Optional<ExaminationProtocol> protocolOptional = examinationProtocolRepository.findById(gradingRepository.findById(grading_id).get().getBeltId());
        if (!protocolOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String exam_protocol = protocolOptional.get().getExaminationProtocol();
        JSONObject root = new JSONObject(exam_protocol);
        JSONArray categories = root.getJSONArray("categories");
        Map<String, Object> response = new HashMap<>();

        if(categories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        int techniqueCount = 0;
        //Check the total number of techniques in the examination
        for (int i = 0; i < categories.length(); i++) {
            JSONObject category = categories.getJSONObject(i);
            JSONArray techniques = category.getJSONArray("techniques");
            techniqueCount += techniques.length();
        }
        response.put("totalTechniques", techniqueCount);
        
        
        List<Map<String, String>> examineeResults = new ArrayList<>();
        //Check the number of passed techniques for each examinee
        for (Examinee examinee : examinees) {
            Map<String, String> examineeInfo = new HashMap<>();
            long passedTechniques = examinationResultRepository.countByExamineeIdAndPassTrue(examinee.getExamineeId());
            long failedTechniques = examinationResultRepository.countByExamineeIdAndPassFalse(examinee.getExamineeId());
            examineeInfo.put("examineeId", examinee.getExamineeId().toString());
            examineeInfo.put("passedTechniques", Long.toString(passedTechniques)); // Convert long to Long and invoke toString()
            examineeInfo.put("name", examinee.getName());
            examineeInfo.put("failedTechniques", Long.toString(failedTechniques));
            examineeResults.add(examineeInfo);
        }
        response.put("examineeResults", examineeResults);
        if(response.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(response);
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
    // TODO 
    @GetMapping("/examresult/{grading_id}")
    public ResponseEntity<List<Map<String, Object>>> getExaminationProtocol(@PathVariable("grading_id") long grading_id, @RequestParam("technique_name") String technique_name) {
        List<Examinee> examinees = examineeRepository.findByGradingId(grading_id);
        List<ExaminationResult> examinationResults = examinationResultRepository.findAll();
        List<Map<String, Object>> results = new ArrayList<>();
        for(Examinee e : examinees) {
            for(ExaminationResult er : examinationResults) {
                if(er.getExamineeId() == e.getExamineeId() && er.getTechniqueName().equals(technique_name)) {
                    Map<String, Object> result = new HashMap<>();
                    result.put("examinee_id", e.getExamineeId());
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
    @GetMapping("/examresult/{grading_id}/{examinee_id}")
    public ResponseEntity<List<ExaminationResult>>  getExaminationProtocolByExaminee(@PathVariable("grading_id") long grading_id, @PathVariable("examinee_id") long examinee_id) {
        List<ExaminationResult> examinationResults = examinationResultRepository.findAll();
        ArrayList<ExaminationResult> matching_results = new ArrayList<>();
        for(ExaminationResult er : examinationResults) {
            if(er.getExamineeId() == examinee_id) {
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
    /**
     * Generate a pdf for an examination
     * @param grading_id
     * @param belt_id
     * @return
     * @throws IOException
     */
    @GetMapping("exportpdf/{grading_id}")
    public ResponseEntity<Object> exportExaminationToPdf(@PathVariable("grading_id") long grading_id) throws IOException {
        Optional<Grading> grading = gradingRepository.findById(grading_id);
        if(grading.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ExportGradingPdf pdfExport = new ExportGradingPdf(examinationProtocolRepository.findByBeltId(grading.get().getBeltId()).getExaminationProtocol().toString(),gradingRepository.findById(grading_id).get(), examineeRepository.findByGradingId(grading_id), examinationResultRepository.findAll(), examinationCommentRepository.findByGradingId(grading_id), examineePairRepository.findAll());

        try {
            InputStream stream = pdfExport.generate();
            return new ResponseEntity<Object>( Base64.getEncoder().encode(stream.readAllBytes()), HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(null, HttpStatus.BAD_REQUEST);   
        }     
    }

    /**
     * Returns a examination protocol given an examinee ID.
     * @return A examination protocol.  
     * @return HTTP-status code.
     */
    @GetMapping("/exportExamineePDF/{examinee_id}")
    public ResponseEntity<Object> exportExamineeToPdf(@PathVariable("examinee_id") long examinee_id) throws IOException {
        Optional<Examinee> examinee = examineeRepository.findById(examinee_id);
        if(examinee.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ExportGradingExamineePdf pdfExport = new ExportGradingExamineePdf(examinationProtocolRepository.findByBeltId(gradingRepository.findById(examinee.get().getGradingId()).get().getBeltId()).getExaminationProtocol().toString(), gradingRepository.findById(examinee.get().getGradingId()).get(),examinee.get(),examinationResultRepository.findByExamineeId(examinee_id),examinationCommentRepository.findByGradingId(examinee.get().getGradingId()),examineePairRepository.findAll(),examineeRepository.findByGradingId(examinee.get().getGradingId()));
        
        try {
            InputStream stream = pdfExport.generate();
            return new ResponseEntity<Object>( Base64.getEncoder().encode(stream.readAllBytes()), HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(null, HttpStatus.BAD_REQUEST);   
        } 
    }

}