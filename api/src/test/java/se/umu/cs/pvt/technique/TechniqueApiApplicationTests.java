package se.umu.cs.pvt.technique;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
 * @author Quattro Formaggio, Calrkskrove
 */

@ExtendWith(MockitoExtension.class)

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TechniqueApiApplicationTests {

    @Mock
    private TechniqueRepository repository = Mockito.mock(TechniqueRepository.class);
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
        controller = new TechniqueController(repository);

        techniques = new ArrayList<>();
        techniques.add(tec1);
        techniques.add(tec2);
    }

    @Test
    void postingTechniqueWithNoNameReturnsBadRequest() {
        Technique invalid = new Technique(32L, "", "No name");
        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postTechnique(invalid).getStatusCode());
    }

    /**
     * Tries to update a non-existing technique. Checks that the result is equal to BAD_REQUEST.
     */
    @Test
    void testUpdatingANonExistingTechnique(){
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());
        controller.updateTechnique(tec1);
        assertEquals(HttpStatus.BAD_REQUEST, controller.updateTechnique(tec1).getStatusCode());
    }

    /**
     * Tries to update a non-existing technique. Checks that the result is NOT equal to OK.
     */
    @Test
    void testUpdatingANonExistingTechniqueFail(){
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());
        controller.updateTechnique(tec1);
        assertNotEquals(HttpStatus.OK, controller.updateTechnique(tec1).getStatusCode());
    }

    /**
     * Tries to update a technique with an invalid format and receives Http status bad request.
     */
    @Test
    void updateExerciseWithInvalidFormatShouldFail() {
        Technique technique = new Technique(1L, "", "teknik 1");
        Mockito.when(repository.findById(technique.getId())).thenReturn(Optional.of(technique));

        ResponseEntity<Object> response = controller.updateTechnique(technique);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Updates an existing technique with a valid format and receives Http status OK.
     */
    @Test
    void updateExistingTechniqueShouldSucceed() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.ofNullable(tec1));

        assertEquals(HttpStatus.OK, controller.updateTechnique(tec1).getStatusCode());
    }

    /**
     * Updating a technique so that it has empty name should return a bad
     * request.
     */
    @Test
    void updateToNoNameMakesBadRequest() {
        Technique invalid = new Technique(1L, "", "No name");
        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.updateTechnique(invalid).getStatusCode());
    }

    /**
     * Checks if test returns all the right imported JSON-techniques.
     */
    @Test
    void postImportReturnsOkStatusOnSuccess() {
        Mockito.when(repository.save(tec1)).thenReturn(tec1);
        Mockito.when(repository.save(tec2)).thenReturn(tec2);
        ResponseEntity response = controller.postImport(techniques);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    /**
     * Post-import with some invalid technique (with no name), returns a bad
     * request. Note the valid techniques may still be added.
     */
    @Test
    void postImportReturnsUnprocessableEntityOnSomeInvalidFormattedTechnique() {
        List<Technique> toAdd = new ArrayList<>();
        toAdd.add(new Technique(1L, "Wihu", "Invalid"));
        toAdd.add(new Technique(2L, "", "Invalid"));

        Mockito.when(repository.findByName("Wihu")).thenReturn(toAdd.get(0));

        Assertions.assertEquals(HttpStatus.UNPROCESSABLE_ENTITY,
                controller.postImport(toAdd).getStatusCode());
    }

    @Test
    void postImportReturnsBadRequestOnNullInput() {
        ResponseEntity response = controller.postImport(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Tries to remove a non-existing technique. Checks that the result is equal to BAD_REQUEST.
     */
    @Test
    void removeNonExistingTechnique(){
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());

        assertEquals(HttpStatus.BAD_REQUEST, controller.removeTechnique(tec1.getId()).getStatusCode());
    }

    /**
     * Checks if test returns all techniques.
     */
    @Test
    void getExercisesShouldReturnAllExercises() {
        Mockito.when(repository.findAll()).thenReturn(techniques);

        List<Technique> result = (List<Technique>) controller.getTechniques();

        assertThat(result.get(0)).isEqualTo(tec1);
        assertThat(result.get(1)).isEqualTo(tec2);
    }

    /**
     * Checks if test returns correct technique with id.
     */
    @Test
    void getExerciseWithRealIdShouldReturnExercise() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.ofNullable(tec1));
        Mockito.when(repository.existsById(tec1.getId())).thenReturn(true);
        Technique result = (Technique) controller.getTechniques(tec1.getId());

        assertThat(result).isEqualTo(tec1);
    }
}