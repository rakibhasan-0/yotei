package se.umu.cs.pvt.technique;

import org.junit.jupiter.api.Assertions;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

/**
 * A test-class for testing the methods inside TechniqueController, API.
 *
 * @author Quattro Formaggio, Calrkskrove, Phoenix (25-04-2023)
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = TechniqueController.class)
public class TechniqueApiApplicationTests {

    @MockBean
    private TechniqueRepository repository;
    @Autowired
    private TechniqueController controller;
    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    private final Technique tec1 = new Technique(1L, "Test1", "Descripton1");
    private final Technique tec2 = new Technique(2L, "Test2", "Descripton2");
    private ArrayList<Technique> techniques;

    @BeforeEach
    public void init() {
        techniques = new ArrayList<>();
        techniques.add(tec1);
        techniques.add(tec2);
    }

    @Test
    void shouldFailWhenPostingTechniqueWithNoName() {
        Technique invalid = new Technique(32L, "", "No name");
        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postTechnique(invalid).getStatusCode());
    }


    @Test
    void shouldSucceedWhenUpdatingNonExistingTechnique() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());
        controller.updateTechnique(tec1);
        assertEquals(HttpStatus.BAD_REQUEST, controller.updateTechnique(tec1).getStatusCode());
    }


    @Test
    void shouldFailWhenUpdatingNonExistingTechnique() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());
        controller.updateTechnique(tec1);
        assertNotEquals(HttpStatus.OK, controller.updateTechnique(tec1).getStatusCode());
    }


    @Test
    void shouldFailWhenUpdatingExerciseWithInvalidFormat() {
        Technique technique = new Technique(1L, "", "teknik 1");
        Mockito.when(repository.findById(technique.getId())).thenReturn(Optional.of(technique));

        ResponseEntity<Object> response = controller.updateTechnique(technique);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldSucceedWhenUpdatingExistingTechnique() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.ofNullable(tec1));

        assertEquals(HttpStatus.OK, controller.updateTechnique(tec1).getStatusCode());
    }


    @Test
    void shouldMakeBadeRequestWhenUpdatingToNoName() {
        Technique invalid = new Technique(1L, "", "No name");
        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.updateTechnique(invalid).getStatusCode());
    }


    @Test
    void shouldSucceedWhenPostImportReturnsOkStatus() {
        Mockito.when(repository.save(tec1)).thenReturn(tec1);
        Mockito.when(repository.save(tec2)).thenReturn(tec2);
        ResponseEntity response = controller.postImport(techniques);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }


    @Test
    void shouldReturnUnprocessableEntityFromPostImportOnSomeInvalidFormattedTechnique() {
        List<Technique> toAdd = new ArrayList<>();
        toAdd.add(new Technique(1L, "Wihu", "Invalid"));
        toAdd.add(new Technique(2L, "", "Invalid"));

        Mockito.when(repository.findByName("Wihu")).thenReturn(toAdd.get(0));

        Assertions.assertEquals(HttpStatus.UNPROCESSABLE_ENTITY,
                controller.postImport(toAdd).getStatusCode());
    }


    @Test
    void shouldReturnBadRequestFromPostImportOnNullInput() {
        ResponseEntity response = controller.postImport(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldFailWhenRemovingNoneExistingTechnique(){
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());

        assertEquals(HttpStatus.BAD_REQUEST, controller.removeTechnique(tec1.getId()).getStatusCode());
    }


    @Test
    void shouldReturnAllExercisesFromGetExercises() {
        Mockito.when(repository.findAll()).thenReturn(techniques);

        List<Technique> result = (List<Technique>) controller.getTechniques();

        assertThat(result.get(0)).isEqualTo(tec1);
        assertThat(result.get(1)).isEqualTo(tec2);
    }


    @Test
    void shouldReturnExerciseFromGetExerciseWithRealID() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.ofNullable(tec1));
        Mockito.when(repository.existsById(tec1.getId())).thenReturn(true);
        Technique result = (Technique) controller.getTechniques(tec1.getId());

        assertThat(result).isEqualTo(tec1);
    }
}