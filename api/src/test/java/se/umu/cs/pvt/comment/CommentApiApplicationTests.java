package se.umu.cs.pvt.comment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import se.umu.cs.pvt.ApiApplication;

@WebMvcTest(controllers = CommentController.class)
class CommentApiApplicationTests {
    @MockBean
    private CommentRepository commentRepository;

    @Autowired
    private CommentController controller;

    @Test
    void contextLoads() {
    }

}
