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
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.umu.cs.pvt.media.MediaRepository;
import se.umu.cs.pvt.workout.ActivityRepository;
import se.umu.cs.pvt.workout.WorkoutRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

/**
 * A test-class for the Exercise-controller API-methods.
 *
 * @author Quattro Formaggio, Carlskrove (05-05-2022), Phoenix (25-04-2023)
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = ExerciseController.class)
class ExerciseApiApplicationTests {

    @MockBean
    private ExerciseRepository repository;

    @MockBean
    private WorkoutRepository workoutRepository;

    @MockBean
    private ActivityRepository activityRepository;

    @MockBean
    private MediaRepository mediaRepository;

    @Autowired
    private ExerciseController controller;

    private Exercise ex1 = new Exercise(1L, "Test1", "Descripton1", 10);
    private Exercise ex2 = new Exercise(2L, "Test2", "Descripton2", 20);

    ArrayList<Exercise> exercises;
    @BeforeEach
    void init() {
        exercises = new ArrayList<>();
        exercises.add(ex1);
        exercises.add(ex2);
    }

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }


    @Test
    void shouldGiveBadRequestUpdatingANonExistingExercise(){
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());
        controller.updateExercise(ex1);
        assertEquals(HttpStatus.BAD_REQUEST, controller.updateExercise(ex1).getStatusCode());

    }


    @Test
    void shouldFailUpdatingANonExistingExercise(){
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());
        controller.updateExercise(ex1);
        assertNotEquals(HttpStatus.OK, controller.updateExercise(ex1).getStatusCode());

    }


    @Test
    void shouldFailUpdateExerciseWithInvalidFormat() {
        Exercise exercise = new Exercise(1L, "ex1", "exercise 1", -1);
        Mockito.when(repository.findById(exercise.getId())).thenReturn(Optional.of(exercise));

        ResponseEntity<Object> response = controller.updateExercise(exercise);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldSucceedUpdateExistingExercise() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.ofNullable(ex1));

        assertEquals(HttpStatus.OK, controller.updateExercise(ex1).getStatusCode());
    }


    @Test
    void shouldFailWhenRemovingNonExistingExercise(){
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());

        assertEquals(HttpStatus.BAD_REQUEST, controller.removeExercise(ex1.getId()).getStatusCode());
    }


    @Test
    void shouldSucceedWhenRemovingExistingExercise() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.ofNullable(ex1));

        assertEquals(HttpStatus.OK, controller.removeExercise(ex1.getId()).getStatusCode());

    }


    @Test
    void shouldReturnCorrectListFromPostImport() {
        Mockito.when(repository.save(ex1)).thenReturn(ex1);
        Mockito.when(repository.save(ex2)).thenReturn(ex2);

        ResponseEntity response = (ResponseEntity) controller.postImport(exercises);

        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldReturnAllExercisesSortedNameDesc() {

        Mockito.when(repository.findAll()).thenReturn(exercises);
        
        List<Exercise> result = (List<Exercise>) controller.getExercises("nameDesc");
    
        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(ex2);
        assertThat(result.get(1)).isEqualTo(ex1);
    }

    @Test
    void shouldReturnAllExercisesSortedNameAsc() {

        Mockito.when(repository.findAll()).thenReturn(exercises);
        
        List<Exercise> result = (List<Exercise>) controller.getExercises("nameAsc");
    
        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(ex1);
        assertThat(result.get(1)).isEqualTo(ex2);
    }

    @Test
    void shouldReturnAllExercisesSortedNDurationDesc() {

        Mockito.when(repository.findAll()).thenReturn(exercises);
        
        List<Exercise> result = (List<Exercise>) controller.getExercises("durationDesc");
    
        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(ex2);
        assertThat(result.get(1)).isEqualTo(ex1);
    }


    @Test
    void shouldReturnAllExercisesSortedNDurationAsc() {

        Mockito.when(repository.findAll()).thenReturn(exercises);
        
        List<Exercise> result = (List<Exercise>) controller.getExercises("durationAsc");
    
        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(ex1);
        assertThat(result.get(1)).isEqualTo(ex2);
    }

    @Test
    void shouldFailWhenExerciseHasInvalidNameAndDuration() {
        Exercise exerciseWithInvalidDuration = new Exercise(1L, "Invalid " +
                "exercise", "Negative time", -1);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postExercise(exerciseWithInvalidDuration).getStatusCode());
    }


    @Test
    void  shouldFailWhenExerciseHasNoName() {
        Exercise exerciseWithNoName = new Exercise(1L, "", "No name", 32);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postExercise(exerciseWithNoName).getStatusCode());
    }


    @Test
    void shouldFailWhenExerciseHasInvalidIdAndName() {
        Exercise exerciseWithNullId = new Exercise(null, "", "No name", 32);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postExercise(exerciseWithNullId).getStatusCode());
    }


    @Test
    void shouldFailWhenPostImportHasInvalidFormattedExercise() {
        List<Exercise> toAdd = new ArrayList<>();
        toAdd.add(new Exercise(1L, "Valid", " ", 2));
        toAdd.add(new Exercise(2L, "Invalid", " ", -1));

        Mockito.when(repository.findByName("Valid")).thenReturn(toAdd.get(0));

        Assertions.assertEquals(HttpStatus.UNPROCESSABLE_ENTITY,
                controller.postImport(toAdd).getStatusCode());
    }

    @Test
    void shouldFailWhenUpdatingTestToHaveNegativeDuration() {
        Exercise invalid = new Exercise(2L, "Invalid", " ", -1);
        Mockito.when(repository.findById(invalid.getId())).thenReturn(Optional.of(invalid));

        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.updateExercise(invalid).getStatusCode());
    }


    @Test
    void shouldFailWhenPostImportNull() {
        Assertions.assertEquals(HttpStatus.BAD_REQUEST,
                controller.postImport(null).getStatusCode());
    }


    @Test
    void shouldReturnDescriptionFromGetDescription() {
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
