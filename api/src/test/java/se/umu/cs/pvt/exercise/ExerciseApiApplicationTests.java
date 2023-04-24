package se.umu.cs.pvt.exercise;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

/**
 * A test-class for the Exercise-controller API-methods.
 *
 * @author Quattro Formaggio, Carlskrove (05-05-2022)
 */

@ExtendWith(MockitoExtension.class)

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ExerciseApiApplicationTests {


    @Mock
    private ExerciseRepository repository = Mockito.mock(ExerciseRepository.class);

    @Autowired
    private ExerciseController controller;
    private Exercise ex1 = new Exercise(1L, "Test1", "Descripton1", 10);
    private Exercise ex2 = new Exercise(2L, "Test2", "Descripton2", 20);

    ArrayList<Exercise> exercises;
    @BeforeEach
    void init() {
        controller = new ExerciseController(repository);

        exercises = new ArrayList<>();
        exercises.add(ex1);
        exercises.add(ex2);
    }

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    /**
     * Tries to update a non-existing exercise. Checks that the result is equal to BAD_REQUEST.
     */
    @Test
    void testUpdatingANonExistingExercise(){
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());
        controller.updateExercise(ex1);
        assertEquals(HttpStatus.BAD_REQUEST, controller.updateExercise(ex1).getStatusCode());

    }

    /**
     * Tries to update a non-existing exercise. Checks that the result is NOT equal to OK.
     */
    @Test
    void testUpdatingANonExistingExerciseFail(){
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());
        controller.updateExercise(ex1);
        assertNotEquals(HttpStatus.OK, controller.updateExercise(ex1).getStatusCode());

    }

    /**
     * Updates exercise with valid format and receives Http status bad request.
     */
    @Test
    void updateExerciseWithInvalidFormatShouldFail() {
        Exercise exercise = new Exercise(1L, "ex1", "exercise 1", -1);
        Mockito.when(repository.findById(exercise.getId())).thenReturn(Optional.of(exercise));

        ResponseEntity<Object> response = controller.updateExercise(exercise);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Updates existing exercise with valid format and receives Http status OK.
     */
    @Test
    void updateExistingExerciseShouldSucceed() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.ofNullable(ex1));

        assertEquals(HttpStatus.OK, controller.updateExercise(ex1).getStatusCode());
    }

    /**
     * Tries to remove a non-existing exercise. Checks that the result is equal to BAD_REQUEST.
     */
    @Test
    void removeNonExistingExercise(){
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());

        assertEquals(HttpStatus.BAD_REQUEST, controller.removeExercise(ex1.getId()).getStatusCode());
    }

    
    @Test
    void removeExistingExerciseShouldSucceed() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.ofNullable(ex1));

        assertEquals(HttpStatus.OK, controller.removeExercise(ex1.getId()).getStatusCode());

    }

    /**
     * Checks if test returns the right imported JSON list.
     */
    @Test
    void postImportShouldReturnCorrectList() {
        Mockito.when(repository.save(ex1)).thenReturn(ex1);
        Mockito.when(repository.save(ex2)).thenReturn(ex2);

        ResponseEntity response = (ResponseEntity) controller.postImport(exercises);

        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    /**
     * Checks if test returns all the elements.
     */
    @Test
    void getExercisesShouldReturnAllExercises() {
        Mockito.when(repository.findAll()).thenReturn(exercises);

        List<Exercise> result = (List<Exercise>)controller.getExercises();

        assertThat(result.get(0)).isEqualTo(ex1);
        assertThat(result.get(1)).isEqualTo(ex2);
    }

    /**
     * Checks if test returns one correct id.
     */
    @Test
    void getExerciseWithRealIdShouldReturnExercise() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.ofNullable(ex1));
        Mockito.when(repository.existsById(ex1.getId())).thenReturn(true);

        Exercise result = (Exercise) controller.getExercise(ex1.getId());

        assertThat(result).isEqualTo(ex1);
    }

    /**
     * Checks so posting invalid formatted exercise because of negative time
     * returns bad request.
     */
    @Test
    void exerciseInvalidFormatReturnsBadRequest() {
        Exercise exerciseWithInvalidDuration = new Exercise(1L, "Invalid " +
                "exercise", "Negative time", -1);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postExercise(exerciseWithInvalidDuration).getStatusCode());
    }

    /**
     * Checks so posting invalid formatted exercise because of empty name
     * returns bad request.
     */
    @Test
    void exerciseInvalidFormat2ReturnsBadRequest() {
        Exercise exerciseWithNoName = new Exercise(1L, "", "No name", 32);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postExercise(exerciseWithNoName).getStatusCode());
    }

    /**
     * Checks so posting invalid formatted exercise because of null id
     * returns bad request.
     */
    @Test
    void exerciseInvalidFormat3ReturnsBadRequest() {
        Exercise exerciseWithNullId = new Exercise(null, "", "No name", 32);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postExercise(exerciseWithNullId).getStatusCode());
    }


    /**
     * PostImporting list with some invalid formatted exercise returns bad
     * request, (note the valid exercises may still be added).
     */
    @Test
    void postImportWithSomeInvalidFormattedExerciseReturnsUnprocessableEntity() {
        List<Exercise> toAdd = new ArrayList<>();
        toAdd.add(new Exercise(1L, "Valid", " ", 2));
        toAdd.add(new Exercise(2L, "Invalid", " ", -1));

        Mockito.when(repository.findByName("Valid")).thenReturn(toAdd.get(0));

        Assertions.assertEquals(HttpStatus.UNPROCESSABLE_ENTITY,
                controller.postImport(toAdd).getStatusCode());
    }

    @Test
    void updatingTestToHaveNegativeDurationReturnsBadRequest() {
        Exercise invalid = new Exercise(2L, "Invalid", " ", -1);
        Mockito.when(repository.findById(invalid.getId())).thenReturn(Optional.of(invalid));

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.updateExercise(invalid).getStatusCode());
    }

    /**
     * Post-importing null returns BAD_REQUEST.
     */
    @Test
    void postImportNullReturnsBadRequest() {
        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postImport(null).getStatusCode());
    }

    /**
     * Checks if test returns description.
     */
    @Test
    void getDescriptionShouldReturnDescription() {
        Mockito.when(repository.getExerciseDropDownById(ex1.getId())).thenReturn(Optional.of(new ExerciseDropDownProjection() {
            @Override
            public String getDescription() {
                return ex1.getDescription();
            }

            @Override
            public Integer getDuration() {
                return ex1.getDuration();
            }
        }));
        Mockito.when(repository.existsById(ex1.getId())).thenReturn(true);

        ExerciseDropDownProjection result = (ExerciseDropDownProjection) controller.getDescription(ex1.getId());

        assertThat(result.getDescription()).isEqualTo(ex1.getDescription());
        assertThat(result.getDuration()).isEqualTo(ex1.getDuration());
    }
    
}
