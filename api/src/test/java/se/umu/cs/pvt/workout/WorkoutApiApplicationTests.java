package se.umu.cs.pvt.workout;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

/**
 * As of (18/05-2022) this testclass only tests each individual return statement from each method in the
 * WorkoutController class.
 *
 * @author  Phoenix (25-04-2023)
 */
@ExtendWith(MockitoExtension.class)
class WorkoutApiApplicationTests {

    @LocalServerPort
    private WorkoutController wc;
    private WorkoutController workoutReviewController;
    private Workout workout;

    @Mock
    private WorkoutRepository workoutRepository = Mockito.mock(WorkoutRepository.class);
    private final WorkoutFavoriteRepository workoutFavoriteRepository = Mockito.mock(WorkoutFavoriteRepository.class);
    private WorkoutReviewRepository repository = Mockito.mock(WorkoutReviewRepository.class);

    @BeforeEach
    void init() {
        wc = new WorkoutController(workoutRepository);
        workoutReviewController = new WorkoutController(repository);
    }

    @Test
    void shouldSucceedWithAddWorkout() {
        workout = new Workout(1L, "test", "Description", 1000L,
                LocalDate.of(2022,1,1), LocalDate.of(2022,1,1),
                new Date(),false, 1L);

        Mockito.when(workoutRepository.save(workout)).thenReturn(workout);

        ResponseEntity<Workout> response = wc.postWorkout(workout);
        verify(workoutRepository, times(1)).save(any());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void shouldFailWithRemovingANullWorkout() {
        ResponseEntity<Workout> response = wc.postWorkout(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGettingEmptyWorkout() {
        Mockito.when(workoutRepository.findAllProjectedBy()).thenReturn(new ArrayList<>());

        ResponseEntity<List<WorkoutShort>> response = wc.getWorkouts();
        verify(workoutRepository, times(1)).findAllProjectedBy();
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithGetWorkout() {
        List<WorkoutShort> workoutList = new ArrayList<>();
        WorkoutShort workoutShort = new WorkoutShort() {
            @Override
            public Long getId() {
                return 1L;
            }

            @Override
            public String getName() {
                return "name";
            }

            @Override
            public LocalDate getCreated() {
                return LocalDate.of(2022,1,1);
            }

            @Override
            public Long getAuthor() {
                return 1L;
            }
        };
        workoutList.add(workoutShort);

        Mockito.when(workoutRepository.findAllProjectedBy()).thenReturn(workoutList);

        ResponseEntity<List<WorkoutShort>> response = wc.getWorkouts();
        verify(workoutRepository, times(1)).findAllProjectedBy();
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGetRelevantWorkoutIsEmpty() {
        Mockito.when(workoutRepository.findAllRelevant(1L)).thenReturn(new ArrayList<>());

        ResponseEntity<List<WorkoutShort>> response = wc.getRelevantWorkouts(1);
        verify(workoutRepository, times(1)).findAllRelevant(any());
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithGetRelevantWorkout() {
        List<WorkoutShort> workoutList = new ArrayList<>();
        WorkoutShort workoutShort = new WorkoutShort() {
            @Override
            public Long getId() {
                return 1L;
            }

            @Override
            public String getName() {
                return "name";
            }

            @Override
            public LocalDate getCreated() {
                return LocalDate.of(2022,1,1);
            }

            @Override
            public Long getAuthor() {
                return 1L;
            }
        };
        workoutList.add(workoutShort);

        Mockito.when(workoutRepository.findAllRelevant(1L)).thenReturn(workoutList);

        ResponseEntity<List<WorkoutShort>> response = wc.getRelevantWorkouts(1);
        verify(workoutRepository, times(1)).findAllRelevant(any());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithGetWorkoutDescription() {
        Mockito.when(workoutRepository.findById(1L)).thenReturn(Optional.of(new Workout(1L, "test",
                "Description", 1000L, LocalDate.of(2022,1,1),
                LocalDate.of(2022,1,1), new Date(),false, 1L)));

        Mockito.when(workoutRepository.getWorkoutDropDownById(1L)).
                thenReturn(Optional.of(new WorkoutDropDownProjection() {
            @Override
            public String getDesc() {
                return "test";
            }

            @Override
            public Integer getDuration() {
                return 1;
            }

            @Override
            public LocalDate getCreated() {
                return LocalDate.of(2022,1,1);
            }

            @Override
            public Long getAuthor() {
                return 1L;
            }
        }));

        ResponseEntity<WorkoutDropDownProjection> response = wc.getDescription(1L);
        verify(workoutRepository, times(1)).findById(any());
        verify(workoutRepository, times(1)).getWorkoutDropDownById(any());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGetWorkoutDescriptionIsNull() {
        ResponseEntity<WorkoutDropDownProjection> response = wc.getDescription(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGetWorkoutDescriptionWithWrongId() {
        Mockito.when(workoutRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<WorkoutDropDownProjection> response = wc.getDescription(1L);
        verify(workoutRepository, times(1)).findById(any());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithGetWorkoutById() {
        workout = new Workout(1L, "test", "Description", 1000L,
                LocalDate.of(2022,1,1), LocalDate.of(2022,1,1),
                new Date(),false, 1L);

        Mockito.when(workoutRepository.findById(1L)).thenReturn(Optional.of(workout));

        ResponseEntity<Workout> response = wc.getWorkout(1L);
        verify(workoutRepository, times(2)).findById(any());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGetWorkoutByIdIsNull() {
        ResponseEntity<Workout> response = wc.getWorkout(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGetWorkoutByIdWithWorngId() {
        Mockito.when(workoutRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Workout> response = wc.getWorkout(1L);
        verify(workoutRepository, times(1)).findById(any());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithGetCreatedWorkoutById() {
        WorkoutShort workoutShort = new WorkoutShort() {

            public Long getId() {
                return 1L;
            }

            public String getName() {
                return "name";
            }

            public LocalDate getCreated() {
                return  LocalDate.of(2022,1,1);
            }

            @Override
            public Long getAuthor() {
                return 1L;
            }
        };
        List<WorkoutShort> workoutList = new ArrayList<>();
        workoutList.add(workoutShort);

        Mockito.when(workoutRepository.findAllByAuthor(1L)).thenReturn(workoutList);

        ResponseEntity<List<WorkoutShort>> response = wc.getCreatedWorkouts(1L);
        verify(workoutRepository, times(2)).findAllByAuthor(any());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGetCreatedWorkoutByIdIsNull() {
        ResponseEntity<List<WorkoutShort>> response = wc.getCreatedWorkouts(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailWhenGetCreatedWorkoutByIdWithWrongId() {
        List<WorkoutShort> workoutList = new ArrayList<>();
        Mockito.when(workoutRepository.findAllByAuthor(1L)).thenReturn(workoutList);

        ResponseEntity<List<WorkoutShort>> response = wc.getCreatedWorkouts(1L);
        verify(workoutRepository, times(1)).findAllByAuthor(any());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithDeletingWorkout() {
        workout = new Workout(1L, "test", "Description", 1000L,
                LocalDate.of(2022,1,1), LocalDate.of(2022,1,1),
                new Date(),false, 1L);

        Mockito.when(workoutRepository.findById(1L)).thenReturn(Optional.of(workout));
        doAnswer(invocationOnMock -> null).when(workoutRepository).deleteById(any());

        ResponseEntity<Long> response = wc.deleteWorkout(1L);
        verify(workoutRepository, times(1)).findById(any());
        verify(workoutRepository, times(1)).deleteById(any());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWhenDeletingWorkoutThatIsNull() {
        ResponseEntity<Long> response = wc.deleteWorkout(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailWhenDeletingWorkoutWithWrongId() {
        Mockito.when(workoutRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Long> response = wc.deleteWorkout(1L);
        verify(workoutRepository, times(1)).findById(any());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithUpdatingWorkout() {
        workout = new Workout(1L, "test", "Description", 1000L,
                LocalDate.of(2022,1,1), LocalDate.of(2022,1,1),
                new Date(),false, 1L);

        Mockito.when(workoutRepository.findById(workout.getId())).thenReturn(Optional.of(workout));
        Mockito.when(workoutRepository.save(workout)).thenReturn(workout);

        ResponseEntity<Workout> response = wc.updateWorkout(workout);
        verify(workoutRepository, times(1)).findById(any());
        verify(workoutRepository, times(1)).save(any());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWhenUpdatingWorkoutThatIsNull() {
        ResponseEntity<Workout> response = wc.updateWorkout(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailWhenUpdatingWorkoutWithInvalidId() {
        workout = new Workout(1L, "test", "Description", 1000L,
                LocalDate.of(2022,1,1), LocalDate.of(2022,1,1),
                new Date(),false, 1L);

        Mockito.when(workoutRepository.findById(workout.getId())).thenReturn(Optional.empty());

        ResponseEntity<Workout> response = wc.updateWorkout(workout);
        verify(workoutRepository, times(1)).findById(any());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithAddingWorkoutToFavorites() {
        wc = new WorkoutController(workoutFavoriteRepository);
        WorkoutFavorite workoutFavorite = new WorkoutFavorite();

        Mockito.when(workoutFavoriteRepository.save(workoutFavorite)).thenReturn(workoutFavorite);

        ResponseEntity<WorkoutFavorite> response = wc.markAsFavorite(workoutFavorite);
        verify(workoutFavoriteRepository, times(1)).save(workoutFavorite);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void shouldFailWithAddingWorkoutToFavoritesThatIsNull() {
        wc = new WorkoutController(workoutFavoriteRepository);

        ResponseEntity<WorkoutFavorite> response = wc.markAsFavorite(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithRemovingWorkoutFromFavorites() {
       wc = new WorkoutController(workoutFavoriteRepository);
       WorkoutFavorite workoutFavorite = new WorkoutFavorite();

       Mockito.when(workoutFavoriteRepository.findById(workoutFavorite)).thenReturn(Optional.of(workoutFavorite));
       doAnswer(invocationOnMock -> null).when(workoutFavoriteRepository).deleteById(any());

       ResponseEntity<WorkoutFavorite> response = wc.removeFavorite(workoutFavorite);
       verify(workoutFavoriteRepository, times(1)).findById(any());
       verify(workoutFavoriteRepository, times(1)).deleteById(any());
       assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWithRemovingWorkoutFromFavorites() {
        wc = new WorkoutController(workoutFavoriteRepository);
        WorkoutFavorite workoutFavorite = new WorkoutFavorite();

        Mockito.when(workoutFavoriteRepository.findById(workoutFavorite)).thenReturn(Optional.empty());

        ResponseEntity<WorkoutFavorite> response = wc.removeFavorite(workoutFavorite);
        verify(workoutFavoriteRepository, times(1)).findById(any());
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailWithRemovingWorkoutFromFavoritesThatIsNull() {
        wc = new WorkoutController(workoutFavoriteRepository);

        ResponseEntity<WorkoutFavorite> response = wc.removeFavorite(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldReturnAnEmptyListFromGetFavorites() {
        int id = 1;
        Mockito.when(workoutRepository.findAllFavorites(id)).thenReturn(new ArrayList<>());

        List<Workout> response = wc.getFavorites(id);
        verify(workoutRepository, times(1)).findAllFavorites(id);
        Assertions.assertTrue(response.isEmpty());
    }

    @Test
    void shouldReturnAListFromGetFavorites() {
        int id = 1;
        workout = new Workout(1L, "test", "Description", 1000L,
                LocalDate.of(2022,1,1), LocalDate.of(2022,1,1),
                new Date(),false, 1L);
        List<Workout> workoutList = new ArrayList<>();
        workoutList.add(workout);

        Mockito.when(workoutRepository.findAllFavorites(id)).thenReturn(workoutList);

        List<Workout> response = wc.getFavorites(id);
        verify(workoutRepository, times(1)).findAllFavorites(id);
        Assertions.assertFalse(response.isEmpty());
    }

    @Test
    void shouldReturnTrueWhenGetFavoritesById() {
        int user_id = 1;
        int workout_id = 1;
        workout = new Workout(1L, "test", "Description", 1000L,
                LocalDate.of(2022,1,1), LocalDate.of(2022,1,1),
                new Date(),false, 1L);
        List<Workout> workoutList = new ArrayList<>();
        workoutList.add(workout);

        Mockito.when(workoutRepository.findAllFavorites(user_id)).thenReturn(workoutList);

        boolean response = wc.getFavoriteById(user_id, workout_id);
        verify(workoutRepository, times(1)).findAllFavorites(user_id);
        Assertions.assertTrue(response);
    }

    @Test
    void shouldReturnFalseWhenGetFavoritesById() {
        int user_id = 1;
        int workout_id = 1;

        Mockito.when(workoutRepository.findAllFavorites(user_id)).thenReturn(new ArrayList<>());

        boolean response = wc.getFavoriteById(user_id, workout_id);
        verify(workoutRepository, times(1)).findAllFavorites(user_id);
        Assertions.assertFalse(response);
    }


    @Test
    void shouldSucceedWithGetReview() {
        Mockito.when(repository.findReviewsForWorkout(1)).thenReturn(new ArrayList<WorkoutReviewReturnInterface>());
        assertEquals(HttpStatus.OK, workoutReviewController.getReviewsForWorkout(1).getStatusCode());
    }

    @Test
    void shouldSucceedWithInsertReview() {
        WorkoutReview review = new WorkoutReview((long)1,3,4,5,"Snyggt byggt","fräsig kärra",new Date(1648930522000L));
        Mockito.when(repository.save(review)).thenReturn(review);
        assertEquals(HttpStatus.OK, workoutReviewController.insertReviewForWorkout(review).getStatusCode());
    }

    @Test
    void shouldSucceedWithUpdateReview() {

        WorkoutReview review = new WorkoutReview((long)1,3,4,5,"Snyggt byggt","fräsig kärra",new Date(1648930522000L));
        Mockito.when(repository.save(review)).thenReturn(review);
        Mockito.when(repository.findById(review.getId())).thenReturn(Optional.of(review));
        assertEquals(HttpStatus.OK, workoutReviewController.updateReview(review).getStatusCode());
    }
}