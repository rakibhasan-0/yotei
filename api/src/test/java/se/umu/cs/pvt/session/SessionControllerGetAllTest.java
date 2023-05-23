package se.umu.cs.pvt.session;

import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@WebMvcTest(controllers = SessionController.class)
@ExtendWith(MockitoExtension.class)
public class SessionControllerGetAllTest {
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

    @Autowired
    private SessionController sessionController;

    @MockBean
    private SessionRepository sessionRepository;

    @BeforeEach
    void init() {
        sessionList = new ArrayList<>();

        sessionList.add(testSession1);
        sessionList.add(testSession2);
        sessionList.add(testSession3);
        sessionList.add(testSession4);
    }

    @Test
    void shouldReturnAllSessions() {
        // Arrange
        Mockito.when(sessionRepository.findAll()).thenReturn(sessionList);
        ResponseEntity<List<Session>> result;

        // Act
        result = sessionController.getAll();
        
        // Assert
        assertThat(result.getBody()).isEqualTo(sessionList);
    }
}
