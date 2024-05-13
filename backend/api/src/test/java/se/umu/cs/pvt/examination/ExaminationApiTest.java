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
    private ExaminationCommentRepository examinationCommentRepository;

    @Autowired
    private ExaminationController examinationController;
    
    List<Grading> gradingList;
    List<Examinee> examineeList;
    List<ExamineePair> examineePairList;
    List<ExaminationComment> examineeCommentList;

    @BeforeEach
    void init() {
        this.gradingList = new ArrayList<>();
        this.examineeList = new ArrayList<>();
        this.examineePairList = new ArrayList<>();
        this.examineeCommentList = new ArrayList<>();

        this.gradingList.add(new Grading(1L, 1L, 1L, 1, 1, new Date()));
        this.gradingList.add(new Grading(2L, 1L, 1L, 1, 1, new Date()));
        this.gradingList.add(new Grading(3L, 1L, 1L, 1, 1, new Date()));
        
        this.examineeList.add(new Examinee(1L, "Linus Testman", 2L));
        this.examineeList.add(new Examinee(2L, "Test Testman", 1L));
        this.examineeList.add(new Examinee(3L, "Hannes Testsson", 3L));


        this.examineePairList.add(new ExamineePair(1L, 1L, 2L));
        this.examineePairList.add(new ExamineePair(2L, 2L, 1L));
        this.examineePairList.add(new ExamineePair(3L, 3L, 3L));

        this.examineeCommentList.add(new ExaminationComment(1L,1L,1L,1L,"wasasasasa","Lörimupsum"));
        this.examineeCommentList.add(new ExaminationComment(2L,2L,2L,2L,"lasasasasa","TestTest"));
        this.examineeCommentList.add(new ExaminationComment(3L,3L,3L,3L,"kasasasasa","WestWest"));

        Mockito.when(gradingRepository.findAll()).thenReturn(gradingList);
        Mockito.when(examineeRepository.findAll()).thenReturn(examineeList);
        Mockito.when(examineePairRepository.findAll()).thenReturn(examineePairList);
        Mockito.when(examinationCommentRepository.findAll()).thenReturn(examineeCommentList);
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

    @Test 
    void testGetAllExaminees() {
        int actual = examineeRepository.findAll().size();
        assertEquals(3, actual);
    }

    @Test
    void testGetAllExamineePairs() {
        int actual = examineePairRepository.findAll().size();
        assertEquals(3, actual);
    }

    @Test
    void testGetAllExamineeComments() {
        int actual = examinationCommentRepository.findAll().size();
        assertEquals(3, actual);
    }
}
