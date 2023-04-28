package se.umu.cs.pvt.workout;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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

@WebMvcTest(controllers = ActivityController.class)
@ExtendWith(MockitoExtension.class)
public class ActivityControllerTests {

    private Activity activity;

    @MockBean
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityController controller;

    @Test
    void shouldFailWhenGetActivityIsNull() {
        ResponseEntity<List<Activity>> response = controller.getActivities(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldSucceedFromGetActivities() {
        ResponseEntity<List<Activity>> response = controller.getActivities(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailIfAddActivityIsNull() {
        ResponseEntity<Activity> response = controller.addActivity(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldSucceedFromAddActivity() {
        activity = new Activity();

        Mockito.when(activityRepository.save(activity)).thenReturn(activity);

        ResponseEntity<Activity> response = controller.addActivity(activity);
        verify(activityRepository, times(1)).save(any());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void shouldFailIfUpdateActivityIsNull() {
        ResponseEntity<Activity> response = controller.updateActivity(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldFailIfUpdateActivityIdIsNull() {
        activity = new Activity();
        ResponseEntity<Activity> response = controller.updateActivity(activity);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithUpdatingActivity() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.of(activity));
        Mockito.when(activityRepository.save(activity)).thenReturn(activity);

        ResponseEntity<Activity> response = controller.updateActivity(activity);
        verify(activityRepository, times(1)).findById(activity.getId());
        verify(activityRepository, times(1)).save(activity);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWithUpdatingActivityWithInvalidId() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.empty());

        ResponseEntity<Activity> response = controller.updateActivity(activity);
        verify(activityRepository, times(1)).findById(activity.getId());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void shouldFailWhenDeletingActivityThatIsNull() {
        ResponseEntity<Activity> response = controller.updateActivity(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldSucceedWithDeletingActivity() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.of(activity));
        doAnswer(invocationOnMock -> null).when(activityRepository).deleteById(activity.getId());

        ResponseEntity<Long> response = controller.deleteActivity(activity.getId());
        verify(activityRepository, times(1)).findById(activity.getId());
        verify(activityRepository, times(1)).deleteById(activity.getId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldFailWithDeletingActivityWithInvalidId() {
        activity = new Activity(1L, "name", "description", 1, 1);

        Mockito.when(activityRepository.findById(activity.getId())).thenReturn(Optional.empty());
        ResponseEntity<Long> response = controller.deleteActivity(activity.getId());
        verify(activityRepository, times(1)).findById(activity.getId());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}