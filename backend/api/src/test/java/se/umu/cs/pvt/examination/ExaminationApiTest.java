package se.umu.cs.pvt.examination;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import se.umu.cs.pvt.belt.BeltRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@WebMvcTest(controllers = ExaminationController.class)
@ExtendWith(MockitoExtension.class)
public class ExaminationApiTest {

    @MockBean
    private GradingRepository gradingRepository;
    @MockBean
    private BeltRepository beltRepository;
    @MockBean
    private ExamineePairRepository examineePairRepository;
    @MockBean
    private ExamineeRepository examineeRepository;
    @MockBean
    private ExaminationResultTechniqueRepository examinationResultTechniqueRepository;
    @MockBean
    private ExaminationCommentRepository examinationCommentRepository;

    @Autowired
    private ExaminationController examinationController;
    
    List<Grading> gradingList;

    @BeforeEach
    void init() {
        this.gradingList = new ArrayList<>();
        this.gradingList.add(new Grading(1L, 1L, 1, new Date(), 1L, 1));
        this.gradingList.add(new Grading(2L, 1L, 1, new Date(), 1L, 1));
        this.gradingList.add(new Grading(3L, 1L, 1, new Date(), 1L, 1));
        //examinationController = new ExaminationController(gradingRepository);
        Mockito.when(gradingRepository.findAll()).thenReturn(gradingList);

        // Mockito.when(gradingRepository.findAll()).thenReturn(gradingList);
    }

    /**
     * Standard Spring test
     */
    @Test
    void contextLoads() {
    }

    @Test
    void testControllerWorking() {
        ResponseEntity<String> expected = new ResponseEntity<String>("hello", HttpStatus.OK);
        ResponseEntity<String> actual = examinationController.example();
        assertEquals(expected, actual);
    }

    @Test
    void testGetAllExaminationGradings() {
        int actual = gradingRepository.findAll().size();
        assertEquals(3, actual);
    }
}
