package se.umu.cs.pvt.import_;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import se.umu.cs.pvt.export.*;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

/**
 * Test class for Import Controller endpoint.
 *
 * @author Andre Byström
 * @since 2024-04-18
 * @version 2.0
 */
@WebMvcTest(controllers = ImportController.class)
@ExtendWith(MockitoExtension.class)
public class ImportControllerPostTest {
    @MockBean
    private ImportService importService;

    @Autowired
    private ImportController importController;

    @Test
    public void shouldCallImportExercisesWhenValidExercise() {
        // Arrange
        List<ExerciseExportResponse> responses = List.of(new ExerciseExportResponse(
                "ex",
                "desc",
                10,
                "url testing", 
                new ArrayList<>()));
        ExerciseContainer container = new ExerciseContainer(responses);

        // Act
        importController.importExercises(container);

        // Assert
        verify(importService, times(1)).importExercises(any(List.class));
    }

    @Test
    public void shouldCallImportTechniquesWhenValidTechnique() {
        // Arrange
        List<TechniqueExportResponse> responses = List.of(new TechniqueExportResponse(
                "tech",
                "desc",
                new ArrayList<>(),
                new ArrayList<>()
        ));
        TechniqueContainer container = new TechniqueContainer(responses);

        // Act
        importController.importTechniques(container);

        // Assert
        verify(importService, times(1)).importTechniques(any(List.class));
    }

    @Test
    public void shouldCallImportTechniquesWhenTechniqueBeltsAreNull() {
        // Arrange
        List<TechniqueExportResponse> responses = List.of(new TechniqueExportResponse(
                "tech",
                "desc",
                new ArrayList<>(),
                null
        ));
        TechniqueContainer container = new TechniqueContainer(responses);

        // Act
        importController.importTechniques(container);

        // Assert
        verify(importService, times(1)).importTechniques(any(List.class));
    }
}
