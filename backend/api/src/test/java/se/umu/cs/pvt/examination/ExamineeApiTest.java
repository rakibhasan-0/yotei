package se.umu.cs.pvt.examination;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@WebMvcTest(controllers = ExaminationController.class)
@ExtendWith(MockitoExtension.class)
public class ExamineeApiTest {
    
    @MockBean
    private ExamineeRepository examineeRepository;
    @MockBean
    private ExaminationController examinationController;
    
    List<Examinee> examineeList;

    // @BeforeEach
    // void init() {
    //     this.examineeList = new ArrayList<>();
    //     this.examineeList.add(new Examinee(1L, "Linus Testsson", 2L));
    //     this.examineeList.add(new Examinee(2L, "Marcus Testman", 2L));
    //     this.examineeList.add(new Examinee(3L, "Gabriel Test", 1L));
    //     this.examinationController = new ExaminationController(examineeRepository);
    //     Mockito.when(examineeRepository.findAll()).thenReturn(examineeList);
    // }

    // @Test
    // void testGetAllExaminationGradings() {
    //     int actual = examineeRepository.findAll().size(); 
    //     assertEquals(3, actual);
    // }
}