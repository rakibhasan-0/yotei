package se.umu.cs.pvt.import_;

import org.springframework.stereotype.Service;
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

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Handles importing techniques and exercises.
 *
 * @author 5 Cyclops
 */
@Service
public class ImportService {
    private final ExerciseRepository exerciseRepository;
    private final TagRepository tagRepository;
    private final ExerciseTagRepository exerciseTagRepository;
    private final TechniqueRepository techniqueRepository;
    private final TechniqueTagRepository techniqueTagRepository;
    private final TechniqueBeltRepository techniqueBeltRepository;

    public ImportService(
            ExerciseRepository exerciseRepository,
            TagRepository tagRepository,
            ExerciseTagRepository exerciseTagRepository,
            TechniqueRepository techniqueRepository,
            TechniqueTagRepository techniqueTagRepository,
            TechniqueBeltRepository techniqueBeltRepository) {
        this.exerciseRepository = exerciseRepository;
        this.tagRepository = tagRepository;
        this.exerciseTagRepository = exerciseTagRepository;
        this.techniqueRepository = techniqueRepository;
        this.techniqueTagRepository = techniqueTagRepository;
        this.techniqueBeltRepository = techniqueBeltRepository;
    }


    /**
     * Import the exercises, creating the tags if necessary and tag mapping.
     *
     * If an exercise with the same name already exists, no work for that exercise
     * is done.
     *
     * @param exercises the exercises to import.
     * @return the names of the exercises that could not be imported because they
     * already exist.
     */
    @Transactional
    public List<String> importExercises(List<ExerciseExport> exercises) {
        List<String> skipped = new ArrayList<>();

        for (ExerciseExport exercise : exercises) {
            if (exerciseRepository.getByNameIgnoreCase(exercise.getName()).isPresent()) {
                skipped.add(exercise.getName());
                continue;
            }
            List<Tag> tags = createTagsIfNotExists(exercise.getTags());
            Exercise newExercise = exerciseRepository.save(new Exercise(
                    0L,
                    exercise.getName(),
                    exercise.getDescription(),
                    exercise.getDuration()));
            addExerciseTagMapping(newExercise, tags);
        }

        return skipped;
    }

    /**
     * Import the techniques, creating the tags if necessary and tag mapping. Also
     * creates the mapping for belts.
     *
     * If a technique with the same name already exists, no work for that exercise
     * is done.
     *
     * @param techniques the techniques to import.
     * @return the names of the techniques that could not be imported because they
     * already exist.
     */
    @Transactional
    public List<String> importTechniques(List<TechniqueExport> techniques) {
        List<String> skipped = new ArrayList<>();

        for (TechniqueExport technique : techniques) {

            if(techniqueRepository.getByNameIgnoreCase(technique.getName()).isPresent()) {
                skipped.add(technique.getName());
                continue;
            }
            List<Tag> tags = createTagsIfNotExists(technique.getTags());
            Set<BeltExport> belts = technique.getBelts();

            Technique newTechnique = techniqueRepository.save(new Technique(
                    0L,
                    technique.getName(),
                    technique.getDescription()
            ));
            addTechniqueTagMapping(newTechnique, tags);
            addTechniqueBeltMapping(newTechnique, belts);
        }

        return skipped;
    }

    private void addTechniqueBeltMapping(Technique technique, Set<BeltExport> belts) {
        techniqueBeltRepository.saveAll(
                belts.stream().map(t -> new TechniqueBelt(t.getId(), technique.getId())).toList()
        );
    }

    private List<Tag> createTagsIfNotExists(Set<TagExport> tags) {
        List<Tag> result = new ArrayList<>();

        for (TagExport tag : tags) {
            Optional<Tag> tagOptional = tagRepository.findTagByName(tag.getName().toLowerCase());
            if (tagOptional.isPresent()) {
                result.add(tagOptional.get());
                continue;
            }
            Tag inserted = tagRepository.save(new Tag(0L, tag.getName().toLowerCase()));
            result.add(inserted);
        }

        return result;
    }

    private void addExerciseTagMapping(Exercise exercise, List<Tag> tags) {
        exerciseTagRepository.saveAll(
                tags.stream().map(t -> new ExerciseTag(exercise.getId(), t)).toList());
    }

    private void addTechniqueTagMapping(Technique technique, List<Tag> tags) {
        techniqueTagRepository.saveAll(
                tags.stream().map(t -> new TechniqueTag(technique.getId(), t)).toList());
    }
}
