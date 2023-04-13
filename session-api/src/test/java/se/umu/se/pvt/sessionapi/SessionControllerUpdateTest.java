package se.umu.se.pvt.sessionapi;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

/**
 * Tests for the update method in the session api
 * @author Hawaii, Calzone
 */
@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class SessionControllerUpdateTest {

    private SessionController sessionController;
    private Map<Long, Session> sessionMap;

    private final LocalDate testDate1 = LocalDate.of(2022, 10, 1);
    private final LocalTime testTime = LocalTime.of(10, 0);

    private final Session testSession1 = new Session(1L, "Hej", null, 1L, testDate1, testTime);
    private final Session testSession2 = new Session(2L, null, null, 1L, testDate1, null);
    private final Map<String, Object> mockInput = new HashMap<>();

    @Mock
    private SessionRepository sessionRepository;

    @BeforeEach
    void init() {
        mockInput.put("text", "Uppdaterad");
        mockInput.put("workout", 5L);
        sessionController = new SessionController(sessionRepository);
        sessionMap = new HashMap<>();

        //Mock the "save" call to the repository using custom function call which updates in sessionMap instead
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
        sessionRepository.deleteAll();
    }

    @Test
    void sessionGetsUpdated(){
        sessionMap.put(1L, testSession1);
        sessionController.update(1L, mockInput);
        Session updatedSession = sessionRepository.findById(1L).get();
        assertEquals(updatedSession.getWorkout(), 5L);
        assertEquals(updatedSession.getText(), "Uppdaterad");
    }

    @Test
    void updateNonExistingDoesNothing(){
        sessionMap.put(1L, testSession1);
        sessionController.update(2L, mockInput);

        assertEquals(sessionRepository.findById(1L).get(), testSession1);
    }

    @Test
    void updatesCorrectSession(){
        sessionMap.put(1L, testSession1);
        sessionMap.put(2L, testSession2);
        sessionController.update(1L, mockInput);

        assertEquals(sessionRepository.findById(2L).get(), testSession2);
        assertNotEquals(sessionRepository.findById(1L).get().getText(), "Hej");
        assertNotEquals(sessionRepository.findById(1L).get().getWorkout(), null);
    }

    @Test
    void updateNonExistingReturnsNotFound(){
        sessionMap.put(1L, testSession1);
        ResponseEntity<Session> response = sessionController.update(2L, mockInput);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
    }

    @Test
    void updateExistingReturnsOk(){
        sessionMap.put(1L, testSession1);
        ResponseEntity<Session> response = sessionController.update(1L, mockInput);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
    }
}
