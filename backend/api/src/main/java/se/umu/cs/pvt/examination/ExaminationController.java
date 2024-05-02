package se.umu.cs.pvt.examination;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.belt.BeltRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/examination")
public class ExaminationController {

    private GradingRepository gradingRepository;
    private BeltRepository beltRepository;
    private ExamineePairRepository examineePairRepository;
    private ExamineeRepository examineeRepository;
    private ExaminationResultTechniqueRepository examinationResultTechniqueRepository;
    private ExaminationCommentRepository examinationCommentRepository;

    public ResponseEntity<String> example() {
        return new ResponseEntity<>("hello", HttpStatus.OK);
    }

    @Autowired
    public ExaminationController(GradingRepository gradingRepository, BeltRepository beltRepository, ExamineePairRepository examineePairRepository, 
    ExamineeRepository examineeRepository, ExaminationResultTechniqueRepository examinationResultTechniqueRepository, 
    ExaminationCommentRepository examinationCommentRepository) {
        this.gradingRepository = gradingRepository;
        this.beltRepository = beltRepository;
        this.examineePairRepository = examineePairRepository;
        this.examineeRepository = examineeRepository;
        this.examinationResultTechniqueRepository = examinationResultTechniqueRepository;
        this.examinationCommentRepository = examinationCommentRepository;
    }

    public ExaminationController() {}

    @GetMapping("all")
    public ResponseEntity<List<Grading>> getAll() {
        return new ResponseEntity<>(gradingRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("/create_grading")
    public ResponseEntity<Grading> create(@RequestBody Grading grading) {
        Optional<Belt> belt = beltRepository.findById(grading.getBelt_id());

        if(belt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Grading new_grading = gradingRepository.save(grading);
        return new ResponseEntity<>(new_grading, HttpStatus.OK);
    }

    @PostMapping("/create_examinee")
    public ResponseEntity<Examinee> create(@RequestBody Examinee examinee) {
        Examinee new_examinee = examineeRepository.save(examinee);
        return new ResponseEntity<>(new_examinee, HttpStatus.OK);
    }

    @PostMapping("/create_examination_result_technique")
    public ResponseEntity<ExaminationResultTechnique> create(@RequestBody ExaminationResultTechnique examinationResultTechnique) {
        ExaminationResultTechnique new_examination_result_technique = examinationResultTechniqueRepository.save(examinationResultTechnique);
        return new ResponseEntity<>(new_examination_result_technique, HttpStatus.OK);
    }


    @GetMapping("getAllExamineePairs")
    public ResponseEntity<List<ExamineePair>> getAllExamineePairs() {
        return new ResponseEntity<>(examineePairRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("createExamineePair")
    public ResponseEntity<ExamineePair> createExamineePair(@RequestBody ExamineePair examinee_pair) {
        ExamineePair new_examinee_pair = examineePairRepository.save(examinee_pair);
        return new ResponseEntity<>(new_examinee_pair, HttpStatus.OK);
    }

    @GetMapping("getAllExaminees")
    public ResponseEntity<List<Examinee>> getAllExaminees() {
        return new ResponseEntity<>(examineeRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("getAllExamineesComments")
    public ResponseEntity<List<ExaminationComment>> getAllExamineesComments(@RequestBody Long examinee_id) {
        return new ResponseEntity<>(examinationCommentRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("getAllResultTechniques")
    public ResponseEntity<List<ExaminationResultTechnique>> getAllResultTechniques(@RequestBody Long examinee_id) {
        return new ResponseEntity<>(examinationResultTechniqueRepository.findAll(), HttpStatus.OK);
    }
}
