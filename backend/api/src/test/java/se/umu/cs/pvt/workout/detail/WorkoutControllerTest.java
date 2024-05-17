package se.umu.cs.pvt.workout.detail;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.exercise.ExerciseRepository;
import se.umu.cs.pvt.tag.TagRepository;
import se.umu.cs.pvt.tag.WorkoutTagRepository;
import se.umu.cs.pvt.technique.Technique;
import se.umu.cs.pvt.technique.TechniqueRepository;
import se.umu.cs.pvt.user.InvalidPasswordException;
import se.umu.cs.pvt.user.InvalidUserNameException;
import se.umu.cs.pvt.user.JWTUtil;
import se.umu.cs.pvt.user.User;
import se.umu.cs.pvt.user.User.Role;
import se.umu.cs.pvt.workout.*;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

/**
 * Test class for the WorkoutDetails part of the WorkoutController.
 *
 * @author Grupp 5 cyclops & Team Tomato
 * @updated 2024-04-24 by Team Tomato
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
        @MockBean
        private UserWorkoutRepository userWorkoutRepository;
        @MockBean
        private TagRepository tagRepository;
        @MockBean
        private WorkoutTagRepository workoutTagRepository;

        @MockBean
        private TechniqueRepository techniqueRepository;
        @MockBean
        private ExerciseRepository exerciseRepository;
        @Autowired
        private WorkoutController controller;

        @MockBean
        private JWTUtil jwtUtil;

        @Autowired
        private MockMvc mockMvc;

        @Test
        public void shouldGetWorkoutDetails() throws InvalidPasswordException, InvalidUserNameException,
                        NoSuchAlgorithmException, InvalidKeySpecException {
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
                                                new Technique(1L, "ex1", "desc1", null, null),
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
                                                new Technique(1L, "ex1", "desc1", null, null),
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
                                                new Technique(2L, "ex2", "desc2", null, null),
                                                null));
                User author = new User("hej", "hejsan123!");
                author.setUserId(1L);
                author.setUserRole(Role.ADMIN);

                String token = "testToken123";
                DecodedJWT mockJwt = Mockito.mock(DecodedJWT.class);
                Claim mockClaim = Mockito.mock(Claim.class);
                UserWorkout mockUserWorkout = Mockito.mock(UserWorkout.class);

                when(userWorkoutRepository.findByWorkoutIdAndUserId(1L, 1L)).thenReturn(mockUserWorkout);
                when(mockClaim.asInt()).thenReturn(1);
                when(mockClaim.asString()).thenReturn("ADMIN");
                when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
                when(mockJwt.getClaim("role")).thenReturn(mockClaim);
                when(jwtUtil.validateToken("testToken123")).thenReturn(mockJwt);

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
                                                new ArrayList<>())));

                // Act
                WorkoutDetailResponse response = controller.getWorkoutDetails(
                                token,
                                1L).getBody();

                List<WorkoutDetailResponse.ActivityResponseContainer> activityCategories = response
                                .getActivityCategories();

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

        @Test
        public void shouldReturn404WhenAssociatedTechniqueIsNotFound() {
                ResponseEntity<Object> response = controller.associatedTechniques(1L);
                assertThat(response.getStatusCodeValue()).isEqualTo(404);
        }

        @Test
        public void shouldReturn404WhenAssociatedExerciseIsNotFound() {
                ResponseEntity<Object> response = controller.associatedExercises(1L);
                assertThat(response.getStatusCodeValue()).isEqualTo(404);
        }

        @Test
        public void shouldReturnListOfWorkoutsWhenAnAcitivityHasATechnique() {
                LocalDate dateStart = LocalDate.of(2020, 3, 3);
                Date dateEnd = new GregorianCalendar(2020, Calendar.MARCH, 4).getTime();

                Technique technique = new Technique(1L, "One really hard technique", "Some description", null, null);
                Activity activity = new Activity(2L, "Some good activity", "maybe one descrption?", 40, 2);
                Workout workout = new Workout(3L, "Workout 0", "", 500L, dateStart, dateStart, dateEnd, false, 4L);
                activity.setWorkoutId(workout.getId());
                activity.setTechniqueId(technique.getId());

                List<Activity> activityList = new ArrayList<>();
                activityList.add(activity);

                List<Workout> expected = new ArrayList<>();
                expected.add(workout);

                Mockito.when(techniqueRepository.findById(1L)).thenReturn(Optional.of(technique));
                Mockito.when(activityRepository.findAll()).thenReturn(activityList);
                Mockito.when(workoutRepository.findById(3L)).thenReturn(Optional.of(workout));

                ResponseEntity<Object> response = controller.associatedTechniques(technique.getId());

                assertThat(response.getStatusCodeValue()).isEqualTo(200);
                assertThat(response.getBody()).isEqualTo(expected);
        }

        @Test
        public void shouldReturnListOfWorkoutsWhenAnAcitivityHasAnExercise() {
                LocalDate dateStart = LocalDate.of(2020, 3, 3);
                Date dateEnd = new GregorianCalendar(2020, Calendar.MARCH, 4).getTime();

                Exercise exercise = new Exercise(1L, "some exercise", "", 10);

                Activity activity = new Activity(2L, "Some good activity", "maybe one descrption?", 40, 2);
                Workout workout = new Workout(3L, "Workout 0", "", 500L, dateStart, dateStart, dateEnd, false, 4L);
                activity.setWorkoutId(workout.getId());
                activity.setExerciseId(exercise.getId());

                List<Activity> activityList = new ArrayList<>();
                activityList.add(activity);

                List<Workout> expected = new ArrayList<>();
                expected.add(workout);

                Mockito.when(exerciseRepository.findById(1L)).thenReturn(Optional.of(exercise));
                Mockito.when(activityRepository.findAll()).thenReturn(activityList);
                Mockito.when(workoutRepository.findById(3L)).thenReturn(Optional.of(workout));

                ResponseEntity<Object> response = controller.associatedExercises(exercise.getId());
                assertThat(response.getStatusCodeValue()).isEqualTo(200);
                assertThat(response.getBody()).isEqualTo(expected);
        }

        @Test
        public void shouldReturn403WhenWorkoutIsPrivateAndUserDoesNotHaveAccessToIt() throws Exception {
                User author = new User("author", "password123");
                author.setUserRole(Role.ADMIN);
                author.setUserId(1L);

                User nonAuthor = new User("nonAuthor", "password!");
                nonAuthor.setUserId(2L);
                nonAuthor.setUserRole(Role.USER);

                String token = "testToken123";
                DecodedJWT mockJwt = Mockito.mock(DecodedJWT.class);
                Claim mockClaim = Mockito.mock(Claim.class);
                when(mockClaim.asInt()).thenReturn(2);
                when(mockClaim.asString()).thenReturn("USER");
                when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
                when(mockJwt.getClaim("role")).thenReturn(mockClaim);
                when(jwtUtil.validateToken("testToken123")).thenReturn(mockJwt);
                when(workoutDetailRepository.findById(1L))
                                .thenReturn(Optional.of(new WorkoutDetail(
                                                1L,
                                                "test",
                                                "desc",
                                                10,
                                                null,
                                                null,
                                                null,
                                                true,
                                                author,
                                                List.of(new ActivityDetail(
                                                                2L,
                                                                1L,
                                                                "uppvarmning",
                                                                2,
                                                                "test2",
                                                                "desc2",
                                                                1,
                                                                10,
                                                                new Technique(2L, "ex2", "desc2", null, null),
                                                                null)),
                                                new ArrayList<>())));

                mockMvc.perform(get("/api/workouts/detail/{id}", 1L)
                                .header("token", token))
                                .andExpect(status().isForbidden());

        }

        @Test
        public void shouldReturn404WhenWorkoutDoesNotExist() throws Exception {
                User author = new User("author", "password123");
                author.setUserRole(Role.ADMIN);
                author.setUserId(1L);

                User nonAuthor = new User("nonAuthor", "password!");
                nonAuthor.setUserId(2L);
                nonAuthor.setUserRole(Role.USER);

                String token = "testToken123";
                DecodedJWT mockJwt = Mockito.mock(DecodedJWT.class);
                Claim mockClaim = Mockito.mock(Claim.class);
                when(mockClaim.asInt()).thenReturn(2);
                when(mockClaim.asString()).thenReturn("USER");
                when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
                when(mockJwt.getClaim("role")).thenReturn(mockClaim);
                when(jwtUtil.validateToken("testToken123")).thenReturn(mockJwt);
                when(workoutDetailRepository.findById(1L))
                                .thenReturn(Optional.empty());

                mockMvc.perform(get("/api/workouts/detail/{id}", 1L)
                                .header("token", token))
                                .andExpect(status().isNotFound());

        }

        @Test
        public void shouldReturnWorkoutDetailWhenUserIsAddedToPrivateWorkout() throws Exception {
                User author = new User("author", "password123");
                author.setUserRole(Role.ADMIN);
                author.setUserId(1L);

                User nonAuthor = new User("userName", "password!");
                nonAuthor.setUserId(2L);
                nonAuthor.setUserRole(Role.USER);

                List<ActivityDetail> activityDetails = List.of(new ActivityDetail(
                                2L,
                                1L,
                                "uppvarmning",
                                2,
                                "test2",
                                "desc2",
                                1,
                                10,
                                new Technique(2L, "ex2", "desc2", null, null),
                                null));

                WorkoutDetail privateWorkout = new WorkoutDetail(
                                1L,
                                "Private Workout",
                                "This is a private workout",
                                10,
                                null,
                                null,
                                null,
                                true,
                                author,
                                activityDetails,
                                new ArrayList<>());

                String token = "testToken123";
                DecodedJWT mockJwt = Mockito.mock(DecodedJWT.class);
                Claim mockClaim = Mockito.mock(Claim.class);
                UserWorkout mockUserWorkout = Mockito.mock(UserWorkout.class);

                when(userWorkoutRepository.findByWorkoutIdAndUserId(1L, 2L)).thenReturn(mockUserWorkout);
                when(mockClaim.asInt()).thenReturn(2);
                when(mockClaim.asString()).thenReturn("USER");
                when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
                when(mockJwt.getClaim("role")).thenReturn(mockClaim);
                when(jwtUtil.validateToken("testToken123")).thenReturn(mockJwt);
                when(jwtUtil.generateToken(nonAuthor.getUsername(), nonAuthor.getUserRole().toString(), 2, new ArrayList<Long>()))
                                .thenReturn("testToken123");
                when(workoutDetailRepository.findById(1L))
                                .thenReturn(Optional.of(privateWorkout));

                mockMvc.perform(get("/api/workouts/detail/{id}", 1L)
                                .header("token", token))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Private Workout"));
        }
}
