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
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;


@WebMvcTest(controllers = SessionController.class)
@ExtendWith(MockitoExtension.class)
public class SessionControllerDeleteTest {

    @Autowired
    private SessionController sessionController;
    private List<Session> sessionList;

    private final LocalDate testDate1 = LocalDate.of(2022, 1, 10);
    private final LocalDate testDate2 = LocalDate.of(2022, 1, 14);

    @MockBean
    private SessionRepository sessionRepository;

    @BeforeEach
    void init() {
        sessionList = new ArrayList<>();

        //Mock the "deleteById" call to the repository by instead removing by id in sessionList instead
        Mockito.doAnswer(invocationOnMock -> {
            sessionList.removeIf(session -> session.getId() == invocationOnMock.getArgument(0));
            return null;
        }).when(sessionRepository).deleteById(any());

        //Mock the "findById" call to the repository by filtering out session from sessionList instead
        Mockito.when(sessionRepository.findById(any())).thenAnswer(invocationOnMock ->
                sessionList.stream().filter(session ->
                        session.getId() == invocationOnMock.getArgument(0)).findFirst());

        //To keep Mockito happy (complains about unused mocks otherwise)
        sessionRepository.deleteById(832L);
    }

    @Test
    void removeExistingExerciseBehaviour(){
        sessionList.add(new Session(1L, "hello", null, 2L, testDate1, LocalTime.of(15,0)));

        sessionController.delete(1L);

        assertTrue(sessionRepository.findById(1L).isEmpty());
    }

    @Test
    void removeNoneExistingBehaviour(){
        assertEquals(sessionController.delete(1L).getStatusCode(), HttpStatus.NOT_FOUND);
    }

    @Test
    void removeNoneExistingBehaviourFromNoneEmptyList(){
        sessionList.add(new Session(2L, "hello", null, 2L, testDate1, LocalTime.of(15,0)));
        sessionList.add(new Session(1L, "hello", null, 2L, testDate2, LocalTime.of(15,0)));

        assertEquals(sessionController.delete(3L).getStatusCode(), HttpStatus.NOT_FOUND);
    }


    @Test
    void removeExistingExerciseReturnsOK(){
        sessionList.add(new Session(1L, "hello", null, 2L, testDate1, LocalTime.of(15,0)));
        assertEquals(sessionController.delete(1L).getStatusCode(), HttpStatus.OK);
    }

    @Test
    void removeCorrectExistingExercise(){
        sessionList.add(new Session(2L, "hello", null, 2L, testDate1, LocalTime.of(15,0)));
        sessionList.add(new Session(1L, "hello", null, 2L, testDate2, LocalTime.of(15,0)));

        sessionController.delete(1L);

        assertTrue(sessionRepository.findById(1L).isEmpty());
        assertTrue(sessionRepository.findById(2L).isPresent());
    }

}
