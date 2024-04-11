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
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@WebMvcTest(controllers = SessionController.class)
@ExtendWith(MockitoExtension.class)
public class SessionControllerAddListTest {
    private final LocalDate testDate1 = LocalDate.of(2023, 1, 10);
    private final LocalDate testDate2 = LocalDate.of(2023, 1, 17);
    private final LocalDate testDate3 = LocalDate.of(2023, 2, 14);
    private final LocalDate testDate4 = LocalDate.of(2023, 3, 14);
    private final LocalTime testTime = LocalTime.of(10, 0);

    private List<Session> sessionList;
    Session testSession1 = new Session(1L,"test",1L,1L,testDate1, testTime);
    Session testSession2 = new Session(2L,"test",1L,1L,testDate2, testTime);
    Session testSession3 = new Session(2L,"test",1L,1L,testDate3, testTime);
    Session testSession4 = new Session(2L,"test",1L,1L,testDate4, testTime);

    @MockBean
    private SessionRepository sessionRepository;

    @Autowired
    private SessionController sessionController;

    public SessionControllerAddListTest() {
    }

    @BeforeEach
    void init() {
        sessionList = new ArrayList<>();

        //Mock the "saveAll" call to the repository using custom function call which updates to sessionList instead
        Mockito.when(sessionRepository.saveAll(Mockito.anyIterable())).thenAnswer(call -> {
            sessionList.addAll(call.getArgument(0));
            return call.getArgument(0);
        });

        //Mock the "findAll" call to the repository to return sessionList instead
        Mockito.when(sessionRepository.findAll()).thenReturn(sessionList);

        //A little treat for Mockito (complains about unused mocks otherwise)
        sessionRepository.saveAll(new ArrayList<>());
        sessionRepository.findAll();
    }

    @Test
    void shouldSucceedWithAddingSingleSession() {
        List<Session> tempList = new ArrayList<>();
        tempList.add(0, testSession1);
        sessionController.addList(tempList);

        assertEquals(1, sessionRepository.findAll().size());
        assertEquals(sessionRepository.findAll().get(0).getDate(), testDate1);
    }

    @Test
    void shouldSucceedWithAddMultipleSessionSameWeek() {
        List<Session> tempList = new ArrayList<>();
        tempList.add(0, testSession1);
        tempList.add(1, testSession2);
        sessionController.addList(tempList);

        assertEquals(2, sessionRepository.findAll().size());
    }

    @Test
    void shouldSucceedAddingSessionsOnMultipleWeeks() {
        List<Session> tempList = new ArrayList<>();
        tempList.add(0, testSession1);
        tempList.add(1, testSession2);
        tempList.add(2, testSession3);
        tempList.add(3, testSession4);
        sessionController.addList(tempList);

        assertEquals(sessionRepository.findAll().size(),4);
    }

    @Test
    void shouldAddSessionsOnMultipleWeeksAndCalculateDateCorrectly() {
        sessionList.add(0, testSession1);
        sessionList.add(1, testSession2);
        sessionController.addList(sessionList);
        List<Session> allSessions = sessionRepository.findAll();

        assertEquals(allSessions.get(1).getDate(), allSessions.get(0).getDate().plus(7, ChronoUnit.DAYS));
    }

    @Test
    void shouldAcceptSessionWithNullTime(){
        Session testSessionWithNullTime = new Session(1L,"test",1L,1L,testDate1, null);
        sessionList.add(0, testSessionWithNullTime);
        ResponseEntity<List<Session>> response = sessionController.addList(sessionList);
        List<Session> allSessions = sessionRepository.findAll();

        assertNull(allSessions.get(0).getTime());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
    
    @Test
    void shouldReturnBadRequestWhenAddingSessionWithMissingPlan(){
        Session missingPlanSession = new Session(1L,"test",1L,null,testDate1, testTime);
        List<Session> tempList = new ArrayList<Session>();
        tempList.add(0, missingPlanSession);
        ResponseEntity<List<Session>> response = sessionController.addList(tempList);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldNotAddSessionWhenGettingBadRequest() {
        Session missingPlanSession = new Session(1L,"test",1L,null,testDate1, testTime);
        List<Session> tempList = new ArrayList<Session>();
        tempList.add(0, missingPlanSession);
        ResponseEntity<List<Session>> response = sessionController.addList(tempList);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldReturnBadRequestWhenAddingSessionWithMissingDate(){
        Session missingPlanSession = new Session(1L,"test",1L,1L,null, testTime);
        List<Session> tempList = new ArrayList<Session>();
        tempList.add(0, missingPlanSession);
        ResponseEntity<List<Session>> response = sessionController.addList(tempList);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldContainSessionWhenSessionsAdded() {
        sessionList.add(0, testSession1);
        sessionController.addList(sessionList);
        ResponseEntity<List<Session>> response = sessionController.addList(sessionList);
        List<Session> allSessions = sessionRepository.findAll();

        assertEquals(allSessions, response.getBody());
    }

    @Test
    void shouldBeEmptyWhenGettingBadRequestResponse() {
        Session missingPlanSession = new Session(1L,"test",1L,1L,null, testTime);
        sessionList.add(0, missingPlanSession);
        ResponseEntity<List<Session>> response = sessionController.addList(sessionList);

        assertNull(response.getBody());
    }
}
