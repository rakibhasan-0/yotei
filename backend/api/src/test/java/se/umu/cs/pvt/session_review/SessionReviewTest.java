package se.umu.cs.pvt.session_review;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import se.umu.cs.pvt.session.SessionRepository;
import se.umu.cs.pvt.session.SessionReviewRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;

public class SessionReviewTest {

    @MockBean
    private SessionReviewRepository sessionReviewRepository;

    @BeforeEach
    void init() {
    }

    /**
     * Standard Spring test
     */
    @Test
    void contextLoads() {
        assertTrue(true);
    }
}
