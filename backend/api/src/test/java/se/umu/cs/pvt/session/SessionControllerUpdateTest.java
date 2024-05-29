package se.umu.cs.pvt.session;

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

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import se.umu.cs.pvt.plan.Plan;
import se.umu.cs.pvt.plan.PlanRepository;
import se.umu.cs.pvt.user.JWTUtil;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;

/**
 * Tests for the update method in the session api
 * @author Hawaii, Calzone
 */
@WebMvcTest(controllers = SessionController.class)
@ExtendWith(MockitoExtension.class)
public class SessionControllerUpdateTest {

    @Autowired
    private SessionController sessionController;
    private Map<Long, Session> sessionMap;

    private final LocalDate testDate1 = LocalDate.of(2022, 10, 1);
    private final LocalTime testTime = LocalTime.of(10, 0);

    private final Session testSession1 = new Session(1L, "Hej", null, 1L, testDate1, testTime);
    private final Session testSession2 = new Session(2L, null, null, 1L, testDate1, null);
    private final Map<String, Object> mockInput = new HashMap<>();

    @MockBean
    private SessionRepository sessionRepository;

    @MockBean
    private PlanRepository planRepository;

    @MockBean
    private JWTUtil jwtUtil;

    private String token = "testtoken123";
    private DecodedJWT mockJwt;
    private Claim mockClaim;

    @BeforeEach
    void init() {
        mockInput.put("text", "Uppdaterad");
        mockInput.put("workout", 5L);
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

        Mockito.when(planRepository.getById(Mockito.any())).thenReturn(new Plan(1000L, "test", 1L, null));

        mockJwt = Mockito.mock(DecodedJWT.class);
        mockClaim = Mockito.mock(Claim.class);
        lenient().when(mockClaim.asLong()).thenReturn(1L);
        lenient().when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
        Integer[] perms = {1};
        lenient().when(mockClaim.asList(Integer.class)).thenReturn(new ArrayList<Integer>(Arrays.asList(perms)));
        lenient().when(mockJwt.getClaim("permissions")).thenReturn(mockClaim);
        lenient().when(jwtUtil.validateToken(token)).thenReturn(mockJwt);
    }

    @Test
    void sessionGetsUpdated(){
        sessionMap.put(1L, testSession1);
        sessionController.update(1L, mockInput, token);
        Session updatedSession = sessionRepository.findById(1L).get();
        assertEquals(updatedSession.getWorkout(), 5L);
        assertEquals(updatedSession.getText(), "Uppdaterad");
    }

    @Test
    void updateNonExistingDoesNothing(){
        sessionMap.put(1L, testSession1);
        sessionController.update(2L, mockInput, token);

        assertEquals(sessionRepository.findById(1L).get(), testSession1);
    }

    @Test
    void updatesCorrectSession(){
        sessionMap.put(1L, testSession1);
        sessionMap.put(2L, testSession2);
        sessionController.update(1L, mockInput, token);

        assertEquals(sessionRepository.findById(2L).get(), testSession2);
        assertNotEquals(sessionRepository.findById(1L).get().getText(), "Hej");
        assertNotEquals(sessionRepository.findById(1L).get().getWorkout(), null);
    }

    @Test
    void updateNonExistingReturnsNotFound(){
        sessionMap.put(1L, testSession1);
        ResponseEntity<Session> response = sessionController.update(2L, mockInput, token);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
    }

    @Test
    void updateExistingReturnsOk(){
        sessionMap.put(1L, testSession1);
        ResponseEntity<Session> response = sessionController.update(1L, mockInput, token);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
    }
}
