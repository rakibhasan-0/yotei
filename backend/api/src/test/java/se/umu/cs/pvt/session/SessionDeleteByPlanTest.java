package se.umu.cs.pvt.session;


import org.junit.jupiter.api.AfterEach;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = SessionController.class)
@ExtendWith(MockitoExtension.class)
class SessionDeleteByPlanTest {

    @Autowired
    private SessionController sessionController;
    private List<Session> sessionList;

    private final LocalDate testDate1 = LocalDate.of(2022, 1, 10);
    private final LocalDate testDate2 = LocalDate.of(2022, 1, 14);
    private final LocalTime testTime = LocalTime.of(10, 0);

    Session testSession1 = new Session(1L,"test",1L,1L,testDate1, testTime);
    Session testSession2 = new Session(2L,"test",1L,1L,testDate2, testTime);

    @MockBean
    private SessionRepository sessionRepository;

    @MockBean
    private PlanRepository planRepository;

    @MockBean
    private JWTUtil jwtUtil;

    private String token = "testtoken123";
    private DecodedJWT mockJwt;
    private Claim mockClaim;

    SessionDeleteByPlanTest() {
    }


    @BeforeEach
    void setUp() {
        Mockito.when(planRepository.getById(Mockito.any())).thenReturn(new Plan(1000L, "test", 1L, null));

        mockJwt = Mockito.mock(DecodedJWT.class);
        mockClaim = Mockito.mock(Claim.class);
        when(mockClaim.asLong()).thenReturn(1L);
        when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
        Integer[] perms = {1};
        when(mockClaim.asList(Integer.class)).thenReturn(new ArrayList<Integer>(Arrays.asList(perms)));
        when(mockJwt.getClaim("permissions")).thenReturn(mockClaim);
        when(jwtUtil.validateToken(token)).thenReturn(mockJwt);

        sessionList = new ArrayList<>();
        Mockito.when(sessionRepository.saveAll(Mockito.anyIterable())).thenAnswer(call -> {
            sessionList.addAll(call.getArgument(0));
            return call.getArgument(0);
        });
        Mockito.when(sessionRepository.findAll()).thenReturn(sessionList);
        Mockito.when(sessionRepository.findAllByPlan(Mockito.anyLong())).thenAnswer(call -> {
            List<Session> sessions = new ArrayList<>();
            for (Session session : sessionList) {
                if (session.getPlan() == (call.getArgument(0))) {
                    sessions.add(session);
                }
            }
            return sessions;
        } );
        Mockito.doAnswer(call -> {
            for (int i = sessionList.size()-1; i >= 0; i--) {
                if (sessionList.get(i).getPlan() == (call.getArgument(0))) {
                    sessionList.remove(i);
                }
            }
            return null;
        }).when(sessionRepository).deleteAllByPlan(Mockito.anyLong());
        sessionRepository.deleteAllByPlan(832L);
        sessionRepository.saveAll(new ArrayList<>());
        sessionRepository.findAll();

        List<Session> mockInput = new ArrayList<>();
        mockInput.add(0, testSession1);
        mockInput.add(1, testSession2);
        sessionController.addList(mockInput, token);
    }

    @AfterEach
    void tearDown() {
        sessionRepository = null;
    }

    @org.junit.jupiter.api.Test
    void deleteByPlan() {
        ResponseEntity<Void> response = sessionController.deleteByPlan(1L, token);
        assertEquals(0, sessionList.size());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
    @Test
    void deleteByPlanNotFound() {
        ResponseEntity<Void> response = sessionController.deleteByPlan(2L, token);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}

