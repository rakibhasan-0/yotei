package se.umu.cs.pvt.import_;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.umu.cs.pvt.belt.TechniqueBelt;
import se.umu.cs.pvt.belt.TechniqueBeltRepository;
import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.exercise.ExerciseRepository;
import se.umu.cs.pvt.export.BeltExport;
import se.umu.cs.pvt.export.ExerciseExport;
import se.umu.cs.pvt.export.TagExport;
import se.umu.cs.pvt.export.TechniqueExport;
import se.umu.cs.pvt.tag.*;
import se.umu.cs.pvt.technique.Technique;
import se.umu.cs.pvt.technique.TechniqueRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Test class for Import Service.
 *
 * @author Cyclops (Grupp 5)
 * date: 2023-05-23
 */

@ExtendWith(MockitoExtension.class)
public class ImportServiceTest {
    @Mock
    private ExerciseRepository exerciseRepository;
    @Mock
    private TagRepository tagRepository;
    @Mock
    private ExerciseTagRepository exerciseTagRepository;
    @Mock
    private TechniqueRepository techniqueRepository;
    @Mock
    private TechniqueTagRepository techniqueTagRepository;
    @Mock
    private TechniqueBeltRepository techniqueBeltRepository;

    private ImportService importService;

    @BeforeEach
    public void setup() {
        this.importService = new ImportService(
                exerciseRepository,
                tagRepository,
                exerciseTagRepository,
                techniqueRepository,
                techniqueTagRepository,
                techniqueBeltRepository);
    }

    @Test
    public void shouldNotImportTechniqueWhenAlreadyExist() {
        // Arrange
        TechniqueExport techniqueExport = new TechniqueExport(
                10,
                "tech",
                "desc",
                new HashSet<>(),
                new HashSet<>());
        Technique technique = new Technique(1L, "tech", "desc");
        when(techniqueRepository.getByNameIgnoreCase("tech")).thenReturn(Optional.of(technique));

        // Act
        List<String> result = importService.importTechniques(List.of(techniqueExport));

        // Assert
        assertThat(result.get(0)).isEqualTo(techniqueExport.getName());
        verify(techniqueRepository, times(0)).save(any());
    }

    @Test
    public void shouldNotImportExerciseWhenAlreadyExist() {
        // Arrange
        ExerciseExport exerciseExport = new ExerciseExport(
                12L,
                "ex",
                "desc",
                10,
                new HashSet<>());
        Exercise exercise = new Exercise(1L, "ex", "desc", 10);
        when(exerciseRepository.getByNameIgnoreCase("ex")).thenReturn(Optional.of(exercise));

        // Act
        List<String> result = importService.importExercises(List.of(exerciseExport));

        // Assert
        assertThat(result.get(0)).isEqualTo(exerciseExport.getName());
        verify(exerciseRepository, times(0)).save(any());
    }

    /**
     * Checks that tags are only created if they exist. Also checks:
     * - a technique that is created is not returned in the return list
     * - a technique that does not exist yet is saved
     * - tag mappings are added for all the tags the technique has.
     * - Belt mappings are not created if the technique has no belts.
     * - Case is lowercase for tags.
     */
    @Test
    public void shouldCreateTagsIfNotExists() {
        // Arrange
        Set<TagExport> tags = new HashSet<>();
        TagExport tag1 = new TagExport(1L, "tag");
        TagExport tag2 = new TagExport(12L, "Tag2");
        TagExport tag3 = new TagExport(13L, "Tag3"); // The tag not present in DB.
        tags.add(tag1);
        tags.add(tag2);
        tags.add(tag3);

        Technique technique = new Technique(10L, "tech", "desc");
        TechniqueExport techniqueExport = new TechniqueExport(
                10,
                "tech",
                "desc",
                tags,
                new HashSet<>());

        when(techniqueRepository.getByNameIgnoreCase(techniqueExport.getName())).thenReturn(Optional.empty());
        when(techniqueRepository.save(any())).thenReturn(technique);
        when(tagRepository.findTagByName(tag1.getName())).thenReturn(Optional.of(toTag(tag1)));
        when(tagRepository.findTagByName(tag2.getName().toLowerCase())).thenReturn(Optional.of(toTag(tag2)));
        when(tagRepository.findTagByName(tag3.getName().toLowerCase())).thenReturn(Optional.empty());
        ArgumentCaptor<List<TechniqueBelt>> numBeltMappingsCaptor = ArgumentCaptor.forClass(List.class);
        ArgumentCaptor<List<TechniqueTag>> numTagMappingsCaptor = ArgumentCaptor.forClass(List.class);
        ArgumentCaptor<Tag> tagCaptor = ArgumentCaptor.forClass(Tag.class);

        // Act
        List<String> result = importService.importTechniques(List.of(techniqueExport));

        // Assert
        assertThat(result.size()).isEqualTo(0);
        verify(tagRepository, times(1)).save(tagCaptor.capture());
        assertThat(tagCaptor.getValue().getName()).isEqualTo(tag3.getName().toLowerCase());
        verify(techniqueRepository, times(1)).save(any());
        verify(techniqueTagRepository, times(1)).saveAll(numTagMappingsCaptor.capture());
        assertThat(numTagMappingsCaptor.getValue().size()).isEqualTo(3);
        verify(techniqueBeltRepository, times(1)).saveAll(numBeltMappingsCaptor.capture());
        assertThat(numBeltMappingsCaptor.getValue().size()).isEqualTo(0);
    }

    private Tag toTag(TagExport tagExport) {
        return new Tag(tagExport.getId(), tagExport.getName());
    }

    @Test
    public void shouldAddBeltMappingWhenTechniqueHasBelt() {
        // Arrange
        BeltExport beltExport = new BeltExport(10L);
        Set<BeltExport> beltExports = new HashSet<>();
        beltExports.add(beltExport);
        TechniqueExport techniqueExport = new TechniqueExport(
                10,
                "tech",
                "desc",
                new HashSet<>(),
                beltExports);
        Technique technique = new Technique(10L, "tech", "desc");

        when(techniqueRepository.getByNameIgnoreCase(techniqueExport.getName())).thenReturn(Optional.empty());
        when(techniqueRepository.save(any())).thenReturn(technique);
        ArgumentCaptor<List<TechniqueBelt>> captor = ArgumentCaptor.forClass(List.class);

        // Act
        importService.importTechniques(List.of(techniqueExport));

        // Assert
        verify(techniqueBeltRepository, times(1)).saveAll(captor.capture());
        assertThat(captor.getValue().size()).isEqualTo(1);
        assertThat(captor.getValue().get(0).getBeltId()).isEqualTo(beltExport.getId());
        assertThat(captor.getValue().get(0).getTechniqueId()).isEqualTo(technique.getId());
    }
}
