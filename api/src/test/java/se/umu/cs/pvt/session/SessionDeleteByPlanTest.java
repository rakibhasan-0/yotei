package se.umu.cs.pvt.session;


import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.umu.cs.pvt.session.AddListInput;
import se.umu.cs.pvt.session.Session;
import se.umu.cs.pvt.session.SessionController;
import se.umu.cs.pvt.session.SessionRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class SessionDeleteByPlanTest {

    private SessionController sessionController;
    private List<Session> sessionList;

    private final LocalDate testDate1 = LocalDate.of(2022, 1, 10);
    private final LocalDate testDate2 = LocalDate.of(2022, 1, 14);
    private final LocalTime testTime = LocalTime.of(10, 0);



    @Mock
    private SessionRepository sessionRepository;

    SessionDeleteByPlanTest() {
    }


    @BeforeEach
    void setUp() {
        sessionController = new SessionController(sessionRepository);
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
        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, testTime), new DateAndTime(testDate2, testTime)), 1);
        sessionController.addRepeating(mockInput);
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

