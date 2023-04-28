package se.umu.cs.pvt.session;


import org.junit.jupiter.api.AfterEach;
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
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

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

    SessionDeleteByPlanTest() {
    }


    @BeforeEach
    void setUp() {
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
        sessionController.addList(mockInput);
    }

    @AfterEach
    void tearDown() {
        sessionRepository = null;
    }

    @org.junit.jupiter.api.Test
    void deleteByPlan() {
        ResponseEntity<Void> response = sessionController.deleteByPlan(1L);
        assertEquals(0, sessionList.size());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
    @Test
    void deleteByPlanNotFound() {
        ResponseEntity<Void> response = sessionController.deleteByPlan(2L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}

