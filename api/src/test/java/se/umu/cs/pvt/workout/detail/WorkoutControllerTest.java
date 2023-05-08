package se.umu.cs.pvt.workout.detail;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import se.umu.cs.pvt.technique.Technique;
import se.umu.cs.pvt.user.InvalidPasswordException;
import se.umu.cs.pvt.user.InvalidUserNameException;
import se.umu.cs.pvt.user.User;
import se.umu.cs.pvt.workout.*;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

/**
 * Test class for the WorkoutDetails part of the WorkoutController.
 *
 * @author Grupp 5 cyclops
 */
@WebMvcTest(controllers = WorkoutController.class)
@ExtendWith(MockitoExtension.class)
public class WorkoutControllerTest {
    @MockBean
    private WorkoutDetailRepository workoutDetailRepository;
    @MockBean
    private WorkoutRepository workoutRepository;
    @MockBean
    private WorkoutFavoriteRepository workoutFavoriteRepository;
    @MockBean
    private WorkoutReviewRepository repository;
    @MockBean
    private ActivityRepository activityRepository;

    @Autowired
    private WorkoutController controller;


    @Test
    public void shouldGetWorkoutDetails() throws InvalidPasswordException, InvalidUserNameException, NoSuchAlgorithmException, InvalidKeySpecException {
        // Arrange
        List<ActivityDetail> activityDetails = List.of(
                new ActivityDetail(
                        1L,
                        1L,
                        null,
                        1,
                        "test1",
                        "desc1",
                        1,
                        10,
                        new Technique(1L, "ex1", "desc1"),
                        null),
                new ActivityDetail(
                        1L,
                        1L,
                        null,
                        1,
                        "test2",
                        "desc2",
                        2,
                        10,
                        new Technique(1L, "ex1", "desc1"),
                        null),
                new ActivityDetail(
                        2L,
                        1L,
                        "uppvarmning",
                        2,
                        "test2",
                        "desc2",
                        1,
                        10,
                        new Technique(2L, "ex2", "desc2"),
                        null)
        );
        User author = new User("hej", "hejsan123!");
        author.setUserId(1L);
        
        when(workoutDetailRepository.findById(1L))
                .thenReturn(Optional.of(new WorkoutDetail(
                        1L,
                        "test",
                        "desc",
                        10,
                        null,
                        null,
                        null,
                        false,
                        author,
                        activityDetails,
                        new ArrayList<>()
                )));

        // Act
        WorkoutDetailResponse response = controller.getWorkoutDetails(1L).getBody();
        List<WorkoutDetailResponse.ActivityResponseContainer> activityCategories = response.getActivityCategories();

        // Assert
        // check that the workout is correct.
        assertThat(response.getName()).isEqualTo("test");

        // Check that null categories gets mapped correctly.
        assertThat(activityCategories.get(0).getCategoryName()).isEqualTo(null);
        assertThat(activityCategories.get(0).getActivities().size()).isEqualTo(2);
        assertThat(activityCategories.get(0).getCategoryOrder()).isEqualTo(1);
        assertThat(activityCategories.get(0).getActivities().get(0).getTechnique().getId()).isEqualTo(1);

        // Check that the category uppvarmning gets mapped correctly.
        assertThat(activityCategories.get(1).getCategoryName()).isEqualTo("uppvarmning");
        assertThat(activityCategories.get(1).getActivities().size()).isEqualTo(1);
        assertThat(activityCategories.get(1).getCategoryOrder()).isEqualTo(2);
        assertThat(activityCategories.get(1).getActivities().get(0).getTechnique().getId()).isEqualTo(2);
    }
}
