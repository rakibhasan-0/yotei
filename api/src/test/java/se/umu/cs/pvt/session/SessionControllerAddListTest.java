package se.umu.cs.pvt.session;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.umu.cs.pvt.session.Session;
import se.umu.cs.pvt.session.SessionController;
import se.umu.cs.pvt.session.SessionRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@Deprecated
public class SessionControllerAddListTest {

    private SessionController sessionController;
    private List<Session> sessionList;

    private final LocalDate testDate1 = LocalDate.of(2022, 1, 10);
    private final LocalDate testDate2 = LocalDate.of(2022, 1, 14);
    private final LocalTime testTime = LocalTime.of(10, 0);

    @Mock
    private SessionRepository sessionRepository;

    public SessionControllerAddListTest() {
    }

    @BeforeEach
    void init() {
        sessionController = new SessionController(sessionRepository);
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
    void addSingleSession() {

        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, testTime)), 1);
        sessionController.addRepeating(mockInput);

        assertEquals(sessionRepository.findAll().size(),1);
        assertEquals(sessionRepository.findAll().get(0).getDate(), testDate1);
    }

    @Test
    void addMultipleSessionSameWeek() {

        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, testTime), new DateAndTime(testDate2, testTime)), 1);
        sessionController.addRepeating(mockInput);
        assertEquals(sessionRepository.findAll().size(),2);
    }

    @Test
    void multipleWeeksAddCorrectAmount() {

        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, testTime), new DateAndTime(testDate2, testTime)), 2);
        sessionController.addRepeating(mockInput);
        assertEquals(sessionRepository.findAll().size(),4);
    }

    @Test
    void multipleWeeksCalculatesDateCorrectly() {

        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, testTime), new DateAndTime(testDate2, testTime)), 2);
        sessionController.addRepeating(mockInput);
        List<Session> allSessions = sessionRepository.findAll();
        assertEquals(allSessions.get(2).getDate(), allSessions.get(0).getDate().plus(7, ChronoUnit.DAYS));
    }

    @Test
    void acceptNullTime(){
        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, null)), 1);
        ResponseEntity<List<Session>> response = sessionController.addRepeating(mockInput);
        List<Session> allSessions = sessionRepository.findAll();
        assertNull(allSessions.get(0).getTime());
        assertEquals(response.getStatusCode(), HttpStatus.CREATED);
    }

    @Test
    void badRequestDoesNotAdd() {
        AddListInput missingPlanInput = new AddListInput(null, List.of(new DateAndTime(testDate1, testTime), new DateAndTime(testDate2, testTime)), 2);

        sessionController.addRepeating(missingPlanInput);
        assertEquals(sessionRepository.findAll().size(), 0);
    }

    @Test
    void missingPlanReturnsBadRequest(){
        AddListInput missingPlanInput = new AddListInput(null, List.of(new DateAndTime(testDate1, testTime), new DateAndTime(testDate2, testTime)), 2);

        ResponseEntity<List<Session>> response = sessionController.addRepeating(missingPlanInput);
        assertEquals(response.getStatusCode(), HttpStatus.BAD_REQUEST);
    }

    @Test
    void missingDatesReturnsBadRequest(){
        AddListInput missingDatesInput = new AddListInput(1L, null, 2);

        ResponseEntity<List<Session>> response = sessionController.addRepeating(missingDatesInput);
        assertEquals(response.getStatusCode(), HttpStatus.BAD_REQUEST);
    }

    @Test
    void missingWeeksReturnsBadRequest(){
        AddListInput missingWeeksInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, testTime), new DateAndTime(testDate2, testTime)), null);

        ResponseEntity<List<Session>> response = sessionController.addRepeating(missingWeeksInput);
        assertEquals(response.getStatusCode(), HttpStatus.BAD_REQUEST);
    }

    @Test
    void duplicateDateReturnsBadRequest() {
        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, testTime),
                new DateAndTime(testDate1, testTime.plusHours(1))), 2);

        ResponseEntity<List<Session>> response = sessionController.addRepeating(mockInput);
        assertEquals(response.getStatusCode(), HttpStatus.BAD_REQUEST);
    }

    @Test
    void excessiveDatesReturnsBadRequest() {
        List<DateAndTime> dateList = new ArrayList<>();

        for (int i = 0; i < 8; i++) {
            dateList.add(new DateAndTime(LocalDate.of(2022, 1, i+1), testTime));
        }
        AddListInput mockInput = new AddListInput(1L, dateList, 2);

        ResponseEntity<List<Session>> response = sessionController.addRepeating(mockInput);
        assertEquals(response.getStatusCode(), HttpStatus.BAD_REQUEST);
    }

    @Test
    void createdResponseContainsSessions() {
        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(testDate1, null)), 1);
        ResponseEntity<List<Session>> response = sessionController.addRepeating(mockInput);
        List<Session> allSessions = sessionRepository.findAll();

        assertEquals(response.getBody(), allSessions);
    }

    @Test
    void badRequestResponseContainsNothing() {
        AddListInput mockInput = new AddListInput(1L, List.of(new DateAndTime(null, null)), 1);
        ResponseEntity<List<Session>> response = sessionController.addRepeating(mockInput);

        assertNull(response.getBody());
    }
}
