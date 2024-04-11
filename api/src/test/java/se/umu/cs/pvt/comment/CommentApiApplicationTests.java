package se.umu.cs.pvt.comment;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import static org.assertj.core.api.Assertions.assertThat;


/**
 * A test-class for testing the add method inside CommentController, API.
 *
 * @author Cyclops 2023-05-04
 */
@WebMvcTest(controllers = CommentController.class)
class CommentApiApplicationTests {

        @MockBean
        private CommentRepository commentRepository;

        @Autowired
        private CommentController controller;

        @Test
        void contextLoads() {
            assertThat(controller).isNotNull();
        }

        private final Comment comment1 = new Comment("comment 1");
        private final Comment comment2 = new Comment("comment 2");

        @BeforeEach
        public void init() {
            comment1.setExerciseId(1L);
            comment1.setUserId(1L);
            comment1.setDate();


            comment2.setExerciseId(1L);
            comment2.setUserId(2L);
            comment2.setDate();
        }

        @Test
        void shouldFailWhenPostingCommentWithNoText() {
            Comment invalid = new Comment();
            Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                    controller.addExerciseComment(1L, invalid, 1L).getStatusCode());
        }

        @Test
        void shouldFailWhenPostingCommentWithNoUserId() {
            Comment comment = new Comment("Comment");
            comment.setDate();
            Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                    controller.addExerciseComment(1L, comment, null).getStatusCode());
        }


        @Test
        void shouldFailWhenPostingCommentWithNoExerciseId() {
            Comment comment = new Comment("Comment");
            comment.setDate();
            Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                    controller.addExerciseComment(null, comment, 1L).getStatusCode());
        }

}


