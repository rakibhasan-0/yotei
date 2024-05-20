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
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

/**
 * @author: Team Orange (c19jen, dv22rfg)
 */
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
    @MockBean
    private ExaminationResultRepository resultRepository;
    @MockBean
    private ExaminationProtocolRepository examinationProtocolRepository;

    @Autowired
    private ExaminationController examinationController;

    List<Grading> gradingList;
    List<Examinee> examineeList;
    List<ExamineePair> examineePairList;
    List<ExaminationComment> examineeCommentList;
    List<ExaminationComment> examinationCommentList;
    List<ExaminationComment> examineePairCommentList;
    List<ExaminationResult> resultList;
    List<ExaminationProtocol> protocolList;

    @BeforeEach
    void init() {
        this.gradingList = new ArrayList<>();
        this.examineeList = new ArrayList<>();
        this.examineePairList = new ArrayList<>();
        this.examineeCommentList = new ArrayList<>();
        this.examinationCommentList = new ArrayList<>();
        this.examineePairCommentList = new ArrayList<>();
        this.resultList = new ArrayList<>();
        this.protocolList = new ArrayList<>();

        this.gradingList.add(new Grading(1L, 1L, 1L, 1, 1, new Date()));
        this.gradingList.add(new Grading(2L, 1L, 1L, 1, 1, new Date()));
        this.gradingList.add(new Grading(3L, 1L, 1L, 1, 1, new Date()));

        this.examineeList.add(new Examinee(1L, "Linus Testman", 2L));
        this.examineeList.add(new Examinee(2L, "Test Testman", 1L));
        this.examineeList.add(new Examinee(3L, "Hannes Testsson", 3L));

        this.examineePairList.add(new ExamineePair(1L, 1L, 2L));
        this.examineePairList.add(new ExamineePair(2L, 2L, 1L));
        this.examineePairList.add(new ExamineePair(3L, 3L, 3L));

        this.examineeCommentList.add(new ExaminationComment(1L, 1L, 1L, 1L, "wasasasasa", "EastEast"));
        this.examineeCommentList.add(new ExaminationComment(2L, 2L, 2L, 2L, "lasasasasa", "TestTest"));
        this.examineeCommentList.add(new ExaminationComment(3L, 3L, 3L, 3L, "kasasasasa", "WestWest"));

        this.examineePairCommentList.add(new ExaminationComment(1L, 1L, 1L, 1L, "wasasasasa", "TestTest"));
        this.examineePairCommentList.add(new ExaminationComment(1L, 1L, 1L, 1L, "lasasasasa", "EastEast"));
        this.examineePairCommentList.add(new ExaminationComment(1L, 1L, 1L, 1L, "kasasasasa", "WestWest"));

        this.examinationCommentList.add(new ExaminationComment(1L, 1L, null, null, "wasasasasa", "TestTest"));
        this.examinationCommentList.add(new ExaminationComment(2L, 2L, null, null, "lasasasasa", "WestWest"));
        this.examinationCommentList.add(new ExaminationComment(3L, 3L, null, null, "kasasasasa", "EastEast"));
        this.examinationCommentList.add(new ExaminationComment(4L, 4L, 4L, 4L, "wasasasas", "ShouldNotFind"));
        this.examinationCommentList.add(new ExaminationComment(4L, 4L, null, 4L, "wasasasas", "ShouldNotFind"));
        this.examinationCommentList.add(new ExaminationComment(4L, 4L, 4L, null, "wasasasas", "ShouldNotFind"));

        this.resultList.add(new ExaminationResult(1L, 1L, "Test Class", null));
        this.resultList.add(new ExaminationResult(2L, 2L, "Testing Classing", true));
        this.resultList.add(new ExaminationResult(3L, 3L, "Class Testing", false));

        this.protocolList.add(new ExaminationProtocol(1L, "Test String"));
        this.protocolList.add(new ExaminationProtocol(2L, "Test String"));
        this.protocolList.add(new ExaminationProtocol(3L, "Test String"));

        Mockito.when(gradingRepository.findAll()).thenReturn(gradingList);
        Mockito.when(examineeRepository.findAll()).thenReturn(examineeList);
        Mockito.when(examineePairRepository.findAll()).thenReturn(examineePairList);
        Mockito.when(examinationCommentRepository.findAll()).thenReturn(examineeCommentList);
        Mockito.when(resultRepository.findAll()).thenReturn(resultList);
        Mockito.when(examinationProtocolRepository.findAll()).thenReturn(protocolList);

        Mockito.when(resultRepository.findById(1L)).thenReturn(Optional.ofNullable(resultList.get(0)));
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

    @Test
    void testGetAllResults() {
        int actual = resultRepository.findAll().size();
        assertEquals(3, actual);
    }

    @Test
    void testGetExamineeResultNull() {
        ExaminationResult resultWithNull = resultRepository.findById(1L).get();
        assertEquals(null, resultWithNull.getPass());

    }

    @Test
    void testGetAllExaminationProtocols() {
        int actual = examinationProtocolRepository.findAll().size();
        assertEquals(3, actual);
    }

    @Test
    void testGetExaminationCommentOnTechnique() {

        Mockito.when(examinationCommentRepository
            .findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(1L, "wasasasasa"))
            .thenReturn(examinationCommentList);
        Mockito.when(examinationCommentRepository
            .findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(2L, "lasasasasa"))
            .thenReturn(examinationCommentList);
        Mockito.when(examinationCommentRepository
            .findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(3L, "kasasasasa"))
            .thenReturn(examinationCommentList);

        // Test with existing comments.
        ResponseEntity<List<ExaminationComment>> responseWithComment1 = examinationController
            .getGradingComment(1L, "wasasasasa");
        ResponseEntity<List<ExaminationComment>> responseWithComment2 = examinationController
            .getGradingComment(2L, "lasasasasa");
        ResponseEntity<List<ExaminationComment>> responseWithComment3 = examinationController
            .getGradingComment(3L, "kasasasasa");

        assertEquals(HttpStatus.OK, responseWithComment1.getStatusCode());
        assertEquals(HttpStatus.OK, responseWithComment2.getStatusCode());
        assertEquals(HttpStatus.OK, responseWithComment3.getStatusCode());

        assertNotNull(responseWithComment1.getBody());
        assertNotNull(responseWithComment2.getBody());
        assertNotNull(responseWithComment3.getBody());

        assertEquals("TestTest", responseWithComment1.getBody().get(0).getComment());
        assertEquals("WestWest", responseWithComment2.getBody().get(1).getComment());
        assertEquals("EastEast", responseWithComment3.getBody().get(2).getComment());

        // Test without existing comments.
        Mockito.when(examinationCommentRepository
            .findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(1L, "nonexistentTechnique"))
            .thenReturn(Collections.emptyList());
        ResponseEntity<List<ExaminationComment>> responseWithoutComment = examinationController
            .getGradingComment(1L, "nonexistentTechnique");
        assertEquals(HttpStatus.NOT_FOUND, responseWithoutComment.getStatusCode());
        assertNull(responseWithoutComment.getBody());

        // Test with empty techniqueName.
        Mockito.when(examinationCommentRepository
            .findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(1L, null))
            .thenReturn(Collections.emptyList());
        ResponseEntity<List<ExaminationComment>> responseWithoutTechnique = examinationController.getGradingComment(1L, null);
        assertEquals(HttpStatus.BAD_REQUEST, responseWithoutTechnique.getStatusCode());

        // Test with non-empty ExamineeId and ExamineePairId.
        Mockito.when(examinationCommentRepository
            .findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(4L, "wasasasas"))
            .thenReturn(Collections.emptyList());
        ResponseEntity<List<ExaminationComment>> responseWithNonNullValues = examinationController
            .getGradingComment(4L, "wasasasas");
        assertEquals(HttpStatus.NOT_FOUND, responseWithNonNullValues.getStatusCode());
    }

    @Test
    void testGetExamineeCommentOnTechnique() {

        Mockito.when(examinationCommentRepository.findByExamineeIdAndTechniqueName(1L, "wasasasasa"))
                .thenReturn(examineeCommentList);
        Mockito.when(examinationCommentRepository.findByExamineeIdAndTechniqueName(2L, "lasasasasa"))
                .thenReturn(examineeCommentList);
        Mockito.when(examinationCommentRepository.findByExamineeIdAndTechniqueName(3L, "kasasasasa"))
                .thenReturn(examineeCommentList);

        // Test with existing comments.
        ResponseEntity<List<ExaminationComment>> responseWithComment1 = examinationController.getExamineeComment(1L,
                "wasasasasa");
        ResponseEntity<List<ExaminationComment>> responseWithComment2 = examinationController.getExamineeComment(2L,
                "lasasasasa");
        ResponseEntity<List<ExaminationComment>> responseWithComment3 = examinationController.getExamineeComment(3L,
                "kasasasasa");

        assertEquals(HttpStatus.OK, responseWithComment1.getStatusCode());
        assertEquals(HttpStatus.OK, responseWithComment2.getStatusCode());
        assertEquals(HttpStatus.OK, responseWithComment3.getStatusCode());

        assertNotNull(responseWithComment1.getBody());
        assertNotNull(responseWithComment2.getBody());
        assertNotNull(responseWithComment3.getBody());

        assertEquals("EastEast", responseWithComment1.getBody().get(0).getComment());
        assertEquals("TestTest", responseWithComment2.getBody().get(1).getComment());
        assertEquals("WestWest", responseWithComment3.getBody().get(2).getComment());

        // Test without existing comments.
        Mockito.when(examinationCommentRepository.findByExamineeIdAndTechniqueName(1L, "nonexistentTechnique"))
                .thenReturn(Collections.emptyList());
        ResponseEntity<List<ExaminationComment>> responseWithoutComment = examinationController.getExamineeComment(1L,
                "nonexistentTechnique");
        assertEquals(HttpStatus.NOT_FOUND, responseWithoutComment.getStatusCode());
        assertNull(responseWithoutComment.getBody());

        // Test with empty techniqueName.
        Mockito.when(examinationCommentRepository.findByExamineeIdAndTechniqueName(1L, null))
                .thenReturn(Collections.emptyList());
        ResponseEntity<List<ExaminationComment>> responseWithoutTechnique = examinationController.getExamineeComment(1L,
                null);
        assertEquals(HttpStatus.BAD_REQUEST, responseWithoutTechnique.getStatusCode());
    }

    @Test
    void testGetExamineePairCommentOnTechnique() {

        Mockito.when(examinationCommentRepository.findByExamineePairIdAndTechniqueName(1L, "wasasasasa"))
                .thenReturn(examineePairCommentList);
        Mockito.when(examinationCommentRepository.findByExamineePairIdAndTechniqueName(2L, "lasasasasa"))
                .thenReturn(examineePairCommentList);
        Mockito.when(examinationCommentRepository.findByExamineePairIdAndTechniqueName(3L, "kasasasasa"))
                .thenReturn(examineePairCommentList);

        // Test with existing comments.
        ResponseEntity<List<ExaminationComment>> responseWithComment1 = examinationController.getExamineePairComment(1L,
                "wasasasasa");
        ResponseEntity<List<ExaminationComment>> responseWithComment2 = examinationController.getExamineePairComment(2L,
                "lasasasasa");
        ResponseEntity<List<ExaminationComment>> responseWithComment3 = examinationController.getExamineePairComment(3L,
                "kasasasasa");

        assertEquals(HttpStatus.OK, responseWithComment1.getStatusCode());
        assertEquals(HttpStatus.OK, responseWithComment2.getStatusCode());
        assertEquals(HttpStatus.OK, responseWithComment3.getStatusCode());

        assertNotNull(responseWithComment1.getBody());
        assertNotNull(responseWithComment2.getBody());
        assertNotNull(responseWithComment3.getBody());

        assertEquals("TestTest", responseWithComment1.getBody().get(0).getComment());
        assertEquals("EastEast", responseWithComment2.getBody().get(1).getComment());
        assertEquals("WestWest", responseWithComment3.getBody().get(2).getComment());

        // Test without existing comments.
        Mockito.when(examinationCommentRepository.findByExamineePairIdAndTechniqueName(1L, "nonexistentTechnique"))
                .thenReturn(Collections.emptyList());
        ResponseEntity<List<ExaminationComment>> responseWithoutComment = examinationController
                .getExamineePairComment(1L, "nonexistentTechnique");
        assertEquals(HttpStatus.NOT_FOUND, responseWithoutComment.getStatusCode());
        assertNull(responseWithoutComment.getBody());

        // Test with empty techniqueName.
        Mockito.when(examinationCommentRepository.findByExamineePairIdAndTechniqueName(1L, null))
                .thenReturn(Collections.emptyList());
        ResponseEntity<List<ExaminationComment>> responseWithoutTechnique = examinationController
                .getExamineePairComment(1L, null);
        assertEquals(HttpStatus.BAD_REQUEST, responseWithoutTechnique.getStatusCode());
    }

}