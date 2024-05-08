package se.umu.cs.pvt.export;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import se.umu.cs.pvt.examination.ExamineeRepository;
import se.umu.cs.pvt.examination.ExportGradingPdf;
import se.umu.cs.pvt.examination.GradingRepository;
import se.umu.cs.pvt.session.SessionReviewRepository;

import java.io.IOException;
import java.util.List;



@RestController
@RequestMapping(path = "/api/export/grading")
class GradingExportController 
{
    @Autowired
    ExamineeRepository examineeRepository;
    
    @Autowired
    GradingRepository gradingRepository;

    public GradingExportController(ExamineeRepository examineeRepository, GradingRepository gradingRepository) {
        this.examineeRepository = examineeRepository;
        this.gradingRepository = gradingRepository;
    }

    @Autowired
    public GradingExportController() {

    }

    @RequestMapping("/{grading_id}")
    public ResponseEntity<String> exportGradingToPdf(@PathVariable("grading_id") long grading_id) throws IOException {

        if(gradingRepository.findById(grading_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ExportGradingPdf pdfExport = new ExportGradingPdf(gradingRepository.findById(grading_id).get(), examineeRepository.findAll());

        try {
            pdfExport.generate();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        return new ResponseEntity<String>("hej", HttpStatus.OK);
    }


}