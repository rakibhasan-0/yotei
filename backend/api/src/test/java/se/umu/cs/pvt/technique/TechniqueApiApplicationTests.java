package se.umu.cs.pvt.technique;

import org.junit.jupiter.api.Assertions;
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
import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.media.MediaRepository;
import se.umu.cs.pvt.tag.Tag;
import se.umu.cs.pvt.workout.ActivityRepository;
import se.umu.cs.pvt.workout.WorkoutRepository;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

/**
 * A test-class for testing the methods inside TechniqueController, API.
 *
 * @author Quattro Formaggio, Calrkskrove, Phoenix (2023-04-25), Team
 *         Granatäpple (Grupp 1) (2024-04-23)
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = TechniqueController.class)
public class TechniqueApiApplicationTests {

    @MockBean
    private TechniqueRepository repository;

    @MockBean
    private WorkoutRepository workoutRepository;

    @MockBean
    private TechniqueReviewRepository techniqueReviewRepository;

    @MockBean
    private ActivityRepository activityRepository;

    @MockBean
    private MediaRepository mediaRepository;

    @Autowired
    private TechniqueController techniqueController;

    @Test
    void contextLoads() {
        assertThat(techniqueController).isNotNull();
    }

    private final Tag tag1 = new Tag(1L, "tag1");
    private final Tag tag2 = new Tag(2L, "tag2");
    private final Belt belt1 = new Belt(1L, "grön", "00000", false, false);
    private final Belt belt2 = new Belt(1L, "Vit", "00000", true, false);
    private final Set<Belt> belts = new HashSet<>();
    private final Set<Tag> tags = new HashSet<>();

    private final Technique tec1 = new Technique(1L, "Test1", "Descripton1", new HashSet<>(), new HashSet<>());
    private final Technique tec2 = new Technique(2L, "Test2", "Descripton2", new HashSet<>(), new HashSet<>());
    private ArrayList<Technique> techniques;

    private Technique createTechnique(Long id, String name, String description) {
        return new Technique(id, name, description, new HashSet<>(), new HashSet<>());
    }

    private Technique createTechnique(Long id, String name, String description, Set<Belt> belts, Set<Tag> tags) {
        return new Technique(id, name, description, new HashSet<>(), tags);
    }

    @BeforeEach
    public void init() {
        techniques = new ArrayList<>();
        techniques.add(tec1);
        techniques.add(tec2);

        belts.add(belt1);
        belts.add(belt2);

        tags.add(tag1);
        tags.add(tag2);
    }

    @Test
    void shouldFailWhenPostingTechniqueWithNoName() {
        Technique invalid = createTechnique(32L, "", "No name");
        Assertions.assertEquals(HttpStatus.NOT_ACCEPTABLE,
                techniqueController.postTechnique(invalid).getStatusCode());
    }

    @Test
    void shouldFailWhenUpdatingNonExistingTechnique() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());
        techniqueController.updateTechnique(tec1);
        assertEquals(HttpStatus.NOT_FOUND, techniqueController.updateTechnique(tec1).getStatusCode());
    }

    @Test
    void shouldSuceedWhenUpdatingExistingTechnique() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());
        techniqueController.updateTechnique(tec1);
        assertNotEquals(HttpStatus.OK, techniqueController.updateTechnique(tec1).getStatusCode());
    }

    @Test
    void shouldFailWhenUpdatingExerciseWithInvalidFormat() {
        Technique technique = createTechnique(1L, "", "teknik 1");
        Mockito.when(repository.findById(technique.getId())).thenReturn(Optional.of(technique));

        ResponseEntity<Object> response = techniqueController.updateTechnique(technique);

        assertEquals(HttpStatus.NOT_ACCEPTABLE, response.getStatusCode());
    }

    @Test
    void shouldSucceedWhenUpdatingExistingTechnique() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.ofNullable(tec1));

        assertEquals(HttpStatus.CREATED, techniqueController.updateTechnique(tec1).getStatusCode());
    }

    @Test
    void shouldMakeNotAcceptableWhenUpdatingToNoName() {
        Technique invalid = createTechnique(1L, "", "No name");

        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(invalid));
        Assertions.assertEquals(HttpStatus.NOT_ACCEPTABLE,
                techniqueController.updateTechnique(invalid).getStatusCode());
    }

    @Test
    void shouldFailWhenRemovingNoneExistingTechnique() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.empty());

        assertEquals(HttpStatus.NOT_FOUND, techniqueController.removeTechnique(tec1.getId()).getStatusCode());
    }

    @Test
    void shouldReturnAllExercisesFromGetExercises() {
        Mockito.when(repository.findAll()).thenReturn(techniques);

        ResponseEntity<Object> response = techniqueController.getTechniques();
        List<Technique> result = (List<Technique>) response.getBody();

        assertThat(result.get(0)).isEqualTo(tec1);
        assertThat(result.get(1)).isEqualTo(tec2);
    }

    @Test
    void shouldReturnExerciseFromGetExerciseWithRealID() {
        Mockito.when(repository.findById(tec1.getId())).thenReturn(Optional.ofNullable(tec1));
        Mockito.when(repository.existsById(tec1.getId())).thenReturn(true);

        ResponseEntity<Object> response = techniqueController.getTechniques(tec1.getId());
        Technique result = (Technique) response.getBody();
        assertThat(result).isEqualTo(tec1);
    }

    @Test
    void shouldSucceedWithGetReview() {
        Mockito.when(techniqueReviewRepository.findReviewsForTechnique(1))
                .thenReturn(new ArrayList<TechniqueReviewReturnInterface>());
        assertEquals(HttpStatus.OK, techniqueController.getReviewsForTechnique(1).getStatusCode());
    }

    @Test
    void shouldSucceedWithInsertReview() {
        TechniqueReview review = new TechniqueReview((long) 1, 3, 4, 5, "Snyggt byggt", "fräsig kärra",
                new Date(1648930522000L));
        Mockito.when(techniqueReviewRepository.save(review)).thenReturn(review);
        assertEquals(HttpStatus.OK, techniqueController.insertReviewForTechnique(review).getStatusCode());
    }

    @Test
    void shouldSucceedWithUpdateReview() {

        TechniqueReview review = new TechniqueReview((long) 1, 3, 4, 5, "Snyggt byggt", "fräsig kärra",
                new Date(1648930522000L));
        Mockito.when(techniqueReviewRepository.save(review)).thenReturn(review);
        Mockito.when(techniqueReviewRepository.findById(review.getId())).thenReturn(Optional.of(review));
        assertEquals(HttpStatus.OK, techniqueController.updateReview(review).getStatusCode());
    }
}