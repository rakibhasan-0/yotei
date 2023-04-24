package se.umu.cs.pvt.workout;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

/**
 * As of (18/05-2022) this testclass only tests each individual return statement from each method in the
 * WorkoutController class.
 */

@ExtendWith(MockitoExtension.class)
public class ActivityControllerTests {

    @LocalServerPort
    private ActivityController ac;
    private Activity activity;

    @Mock
    private ActivityRepository activityRepository = Mockito.mock(ActivityRepository.class);

    @BeforeEach
    void init() {
        ac = new ActivityController(activityRepository);
    }

    @Test
    void getActivitiesIsNull() {
        ResponseEntity<List<Activity>> response = ac.getActivities(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void getActivitiesShouldSucceed() {
        ResponseEntity<List<Activity>> response = ac.getActivities(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void addActivityIsNull() {
        ResponseEntity<Activity> response = ac.addActivity(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void addActivityShouldSucceed() {
        activity = new Activity();

        Mockito.when(activityRepository.save(activity)).thenReturn(activity);

        ResponseEntity<Activity> response = ac.addActivity(activity);
        verify(activityRepository, times(1)).save(any());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void updateActivityIsNull() {
        ResponseEntity<Activity> response = ac.updateActivity(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void updateActivityIdIsNull() {
        activity = new Activity();
        ResponseEntity<Activity> response = ac.updateActivity(activity);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void updateActivityShouldSucceed() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.of(activity));
        Mockito.when(activityRepository.save(activity)).thenReturn(activity);

        ResponseEntity<Activity> response = ac.updateActivity(activity);
        verify(activityRepository, times(1)).findById(activity.getId());
        verify(activityRepository, times(1)).save(activity);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void updateActivityWithInvalidId() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.empty());

        ResponseEntity<Activity> response = ac.updateActivity(activity);
        verify(activityRepository, times(1)).findById(activity.getId());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void deleteActivityIsNull() {
        ResponseEntity<Activity> response = ac.updateActivity(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void deleteActivityShouldSucceed() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.of(activity));
        doAnswer(invocationOnMock -> null).when(activityRepository).deleteById(activity.getId());

        ResponseEntity<Long> response = ac.deleteActivity(activity.getId());
        verify(activityRepository, times(1)).findById(activity.getId());
        verify(activityRepository, times(1)).deleteById(activity.getId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void deleteActivityWithInvalidId() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.empty());
        ResponseEntity<Long> response = ac.deleteActivity(activity.getId());
        verify(activityRepository, times(1)).findById(activity.getId());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
