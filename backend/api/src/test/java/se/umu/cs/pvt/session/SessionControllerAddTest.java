package se.umu.cs.pvt.session;

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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;


@WebMvcTest(controllers = SessionController.class)
@ExtendWith(MockitoExtension.class)
public class SessionControllerAddTest {

    @Autowired
    private SessionController sessionController;
    private Map<Long, Session> sessionMap;

    private final LocalDate testDate1 = LocalDate.of(2022, 10, 1);
    private final LocalTime testTime = LocalTime.of(10, 0);

    private final Session testSession1 = new Session(1L, "Hej", null, 1L, testDate1, testTime);
    private final Map<Long, Object> mockInput = new HashMap<>();

    @MockBean
    private SessionRepository sessionRepository;

    @BeforeEach
    void init() {
        mockInput.put(1L, testSession1);
        sessionMap = new HashMap<>();

        Mockito.doAnswer(invocationOnMock -> {
            Session saveSession = invocationOnMock.getArgument(0);
            sessionMap.put(saveSession.getId(), saveSession);
            return null;
        }).when(sessionRepository).save(any());
        
        //Mock the "findById" call to the repository using custom function call which find in sessionMap instead
        Mockito.when(sessionRepository.findById(any())).thenAnswer(invocationOnMock ->
                sessionMap.values().stream().filter(session ->
                        session.getId() == invocationOnMock.getArgument(0)).findFirst());

        //To be on good terms with Mockito (complains about unused mocks otherwise)
        sessionRepository.save(testSession1);
    }

    @Test
    void shouldFailWhenGetNonexistingSession() {
        assertEquals(HttpStatus.BAD_REQUEST, sessionController.get(0L).getStatusCode());
    }

    @Test
    void shouldSucceedWhenGetExistingSession() {
        assertEquals(testSession1, sessionController.get(1L).getBody().get());
    }

}
