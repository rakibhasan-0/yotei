package se.umu.cs.pvt.import_;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.export.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Handles import requests for techniques and exercises.
 *
 * @author Andre Byström
 * date: 2023-05-17
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/import")
public class ImportController {
    private final ImportService importService;

    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @PostMapping("/exercises")
    public ResponseEntity<List<String>> importExercises(@RequestBody ExerciseContainer exerciseContainer) {
        List<ExerciseExport> exerciseExports = exerciseContainer.getExercises().stream()
                .map(e -> {
                    Set<TagExport> tags = e.getTags().stream()
                            .map(t -> new TagExport(0L, t))
                            .collect(Collectors.toSet());
                    return new ExerciseExport(
                            0L,
                            e.getName(),
                            e.getDescription(),
                            e.getDuration(),
                            tags);
                })
                .toList();

        return new ResponseEntity<>(importService.importExercises(exerciseExports), HttpStatus.CREATED);
    }

    @PostMapping("/techniques")
    public ResponseEntity<List<String>> importTechniques(@RequestBody TechniqueContainer techniqueContainer) {
        List<TechniqueExport> techniqueExports = techniqueContainer.getTechniques().stream()
                .map(e -> {
                    Set<TagExport> tags = e.getTags().stream()
                            .map(t -> new TagExport(0L, t))
                            .collect(Collectors.toSet());
                    Set<BeltExport> belts = new HashSet<>();
                    if (e.getBelts() != null) {
                        belts = e.getBelts().stream()
                                .map(BeltExport::new)
                                .collect(Collectors.toSet());
                    }
                    return new TechniqueExport(
                            0L,
                            e.getName(),
                            e.getDescription(),
                            tags,
                            belts
                    );
                })
                .toList();

        return new ResponseEntity<>(importService.importTechniques(techniqueExports), HttpStatus.CREATED);
    }
}
