package se.umu.cs.pvt.examination;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.belt.BeltRepository;
import se.umu.cs.pvt.session.SessionReview;
import se.umu.cs.pvt.session.SessionReviewExerciseRepository;
import se.umu.cs.pvt.session.SessionReviewRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/examination")
public class ExaminationController {

    @Autowired
    private GradingRepository gradingRepository;
    private BeltRepository beltRepository;

    public ResponseEntity<String> example() {
        return new ResponseEntity<>("hello", HttpStatus.OK);
    }

    public ExaminationController(GradingRepository gradingRepository, BeltRepository beltRepository) {
        this.gradingRepository = gradingRepository;
        this.beltRepository = beltRepository;
    }

    @GetMapping("all")
    public ResponseEntity<List<Grading>> getAll() {
        return new ResponseEntity<>(gradingRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<Grading> create(@RequestBody Grading grading) {
        Optional<Belt> belt = beltRepository.findById(grading.getBelt_id());

        if(belt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Grading new_grading = gradingRepository.save(grading);
        return new ResponseEntity<>(new_grading, HttpStatus.OK);
    }
}
