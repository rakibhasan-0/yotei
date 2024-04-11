package se.umu.cs.pvt.export;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

/**
 * Handles export requests for techniques and exercises.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/export")
public class ExportController {
    private final TechniqueExportRepository techniqueExportRepository;
    private final ExerciseExportRepository exerciseExportRepository;

    @Autowired
    public ExportController(TechniqueExportRepository techniqueExportRepository,
                            ExerciseExportRepository exerciseExportRepository) {
        this.techniqueExportRepository = techniqueExportRepository;
        this.exerciseExportRepository = exerciseExportRepository;
    }

    @GetMapping("/techniques")
    public TechniqueContainer exportTechniques() {
        return new TechniqueContainer(
                techniqueExportRepository.findAll().stream()
                        .map(t -> {
                            return new TechniqueExportResponse(
                                    t.getName(),
                                    t.getDescription(),
                                    getTagNames(t.getTags()),
                                    getBelts(t.getBelts()));
                        })
                        .toList());
    }

    @GetMapping("/exercises")
    public ExerciseContainer exportExercises() {
        return new ExerciseContainer(
                exerciseExportRepository.findAll().stream()
                        .map(e -> {
                            return new ExerciseExportResponse(
                                    e.getName(),
                                    e.getDescription(),
                                    e.getDuration(),
                                    getTagNames(e.getTags()));
                        })
                        .toList());
    }

    private List<String> getTagNames(Set<TagExport> tags) {
        return tags.stream()
                .map(TagExport::getName)
                .toList();
    }

    private List<Long> getBelts(Set<BeltExport> belts) {
        return belts.stream()
                .map(BeltExport::getId)
                .toList();
    }
}
