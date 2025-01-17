package se.umu.cs.pvt.export;

import lombok.experimental.WithBy;
import se.umu.cs.pvt.media.MediaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

/**
 * Test class for Belt Controller endpoint.
 *
 * @author Andre Byström, Team Coconut
 * @since: 2024-04-19
 * @version 2.0
 */
@WebMvcTest(controllers = ExportController.class)
@ExtendWith(MockitoExtension.class)
public class ExportControllerGetTest {
    @MockBean
    private TechniqueExportRepository techniqueExportRepository;

    @MockBean
    private ExerciseExportRepository exerciseExportRepository;

    @MockBean
    private MediaRepository mediaRepository;

    @Autowired
    private ExportController exportController;

    @Test
    public void shouldGetTechniques() {
        when(techniqueExportRepository.findAll()).thenReturn(List.of(
           new TechniqueExport(1L,
                   "test",
                   "test",
                   Set.of(new TagExport(1L, "test")),
                   Set.of(new BeltExport(1L))
        )));

        TechniqueExportResponse technique = exportController.exportTechniques().getTechniques().get(0);
        String tag = technique.getTags().get(0);

        assertThat(technique.getName()).isEqualTo("test");
        assertThat(technique.getDescription()).isEqualTo("test");
        assertThat(tag).isEqualTo("test");
        assertThat(technique.getBelts().get(0)).isEqualTo(1L);
    }

    @Test
    public void shouldGetExercises() {
        when(exerciseExportRepository.findAll()).thenReturn(List.of(
                new ExerciseExport(1L,
                        "test",
                        "test",
                        2,
                        Set.of(new TagExport(1L, "test")))
        ));

        ExerciseExportResponse exercise = exportController.exportExercises().getExercises().get(0);
        String tag = exercise.getTags().get(0);

        assertThat(exercise.getName()).isEqualTo("test");
        assertThat(exercise.getDescription()).isEqualTo("test");
        assertThat(exercise.getDuration()).isEqualTo(2);
        assertThat(tag).isEqualTo("test");
    }
}
