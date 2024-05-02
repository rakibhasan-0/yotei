package se.umu.cs.pvt.examination;

import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;



@WebMvcTest(controllers = ExaminationController.class)
@ExtendWith(MockitoExtension.class)
public class ExaminationCommentApiTest {

    @MockBean
    private ExaminationCommentRepository examinationCommentRepository;
    @Autowired
    private ExaminationController examinationController;

}
