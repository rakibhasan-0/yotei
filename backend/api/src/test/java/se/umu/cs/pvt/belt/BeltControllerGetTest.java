package se.umu.cs.pvt.belt;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

/**
 * Test class for Belt Controller endpoint.
 *
 * @author Max Thoren
 * @author Andre Byström
 * date: 2023-04-24
 */
@WebMvcTest(controllers = BeltController.class)
@ExtendWith(MockitoExtension.class)
public class BeltControllerGetTest {

    @MockBean
    private BeltRepository beltRepository;

    @Autowired
    private BeltController controller;
    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    private final Belt belt1 = new Belt(1L, "Vit", "FFFFFF", true, false);
    private final Belt belt2 = new Belt(1L, "Svart", "000000", false, false);
    private ArrayList<Belt> belts;
    
     
    @BeforeEach
    public void init() {
        belts = new ArrayList<>();
        belts.add(belt1);
        belts.add(belt2);
    }


    @Test
    void shouldGetAllBelts() {
        Mockito.when(beltRepository.findAll()).thenReturn(belts);
        ResponseEntity<Object> response = controller.getBelts();
        List<Belt> result = (List<Belt>)response.getBody();

        assertThat(result.size()).isEqualTo(belts.size());
    }

    @Test
    void shouldReturnHttpStatusNotFoundFromGetBeltWithNullID(){
        Mockito.when(beltRepository.findById(belt1.getId())).thenReturn(Optional.ofNullable(belt1));
        Mockito.when(beltRepository.existsById(belt1.getId())).thenReturn(true);

        ResponseEntity<Object> response = controller.getBelts(null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldReturnBeltFromGetBeltWithRealID(){
        List<Long> ids = new ArrayList<>();
        ids.add(belt1.getId());
        List<Belt> stubValues = new ArrayList<>();
        stubValues.add(belts.get(0));
        Mockito.when(beltRepository.findAllById(ids)).thenReturn(stubValues);
        Mockito.when(beltRepository.existsById(belt1.getId())).thenReturn(true);

        ResponseEntity<Object> response = controller.getBelts(ids);
        List<Belt> result = (List<Belt>) response.getBody();

        assertThat(result.get(0)).isEqualTo(belt1);
    }

    @Test
    void shouldFailBeltFromGetBeltWithRealIDAndNull(){
        List<Long> ids = new ArrayList<>();
        ids.add(belt1.getId());
        ids.add(null);
        List<Belt> stubValues = new ArrayList<>();
        stubValues.add(belts.get(0));
        

        Mockito.when(beltRepository.findAllById(ids)).thenReturn(stubValues);
        Mockito.when(beltRepository.existsById(belt1.getId())).thenReturn(true);

        ResponseEntity<Object> response = controller.getBelts(ids);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldFailBeltFromGetBeltWithRealIDButOutOfBounds(){
        List<Long> ids = new ArrayList<>();
        ids.add((long)100);
        ids.add(null);
        List<Belt> stubValues = new ArrayList<>();
        

        Mockito.when(beltRepository.findAllById(ids)).thenReturn(stubValues);

        ResponseEntity<Object> response = controller.getBelts(ids);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldFailBeltFromGetBeltWithNegativeNumber(){
        List<Long> ids = new ArrayList<>();
        ids.add((long) -1);

        List<Belt> stubValues = new ArrayList<>();
        stubValues.add(belts.get(0));
        
        Mockito.when(beltRepository.findAllById(ids)).thenReturn(stubValues);
        Mockito.when(beltRepository.existsById(belt1.getId())).thenReturn(true);

        ResponseEntity<Object> response = controller.getBelts(ids);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
