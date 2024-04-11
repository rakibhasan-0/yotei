package se.umu.cs.pvt.errorlog;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

/**
 * Test class for error logging
 *
 * @author Team 3 Dragon
 * date: 2024-05-03
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = ErrorLogController.class)
class ErrorLogControllerTest {

    @MockBean
    private ErrorLogRepository repository;

    @Autowired
    private ErrorLogController controller;

    private ErrorLog el1;
    private ErrorLog el2;
    ArrayList<ErrorLog> errorLogList;

    @BeforeEach
    void init(){
        this.errorLogList = new ArrayList<>();

        DateFormat df = new SimpleDateFormat("MM-dd-yyyy");
        try {
            Date d1 = df.parse("12-10-2011");
            Date d2 = df.parse("01-01-1900");
            this.el1 = new ErrorLog(1L, "Error Message 1", "Info Message 1", d1);
            this.el2 = new ErrorLog(2L, "Error Message 2", "Info Message 2", d2);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        errorLogList.add(el1);
        errorLogList.add(el2);
    }

    @Test
    void contextLoads(){
        assertThat(controller).isNotNull();
    }

    @Test
    void shouldReturnAllErrors(){
        // All created logs should be accessible 
        Mockito.when(repository.findAll()).thenReturn(errorLogList);
        List<ErrorLog> result = (List<ErrorLog>)controller.getErrorLogs();

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(el1);
        assertThat(result.get(1)).isEqualTo(el2);
        assertThat(result.get(0)).isNotEqualTo(el2);
    }

    @Test
    void shouldReturnCorrectMessages(){
        // Match title after lookup
        Mockito.when(repository.findAll()).thenReturn(errorLogList);
        List<ErrorLog> result = (List<ErrorLog>)controller.getErrorLogs();
        assertThat(result.get(0).getInfoMessage()).isEqualTo("Info Message 1");
        assertThat(result.get(0).getErrorMessage()).isEqualTo("Error Message 1");
    }

    @Test
    void shouldSaveOnCorrectJSON(){
        Mockito.when(repository.findAll()).thenReturn(errorLogList);
        // String postJsonObject = 
    }
}
