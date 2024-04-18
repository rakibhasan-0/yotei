package se.umu.cs.pvt.export;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import se.umu.cs.pvt.media.MediaRepository;
import se.umu.cs.pvt.media.Media;

import java.util.List;
import java.util.Set;

/**
 * Handles export requests for techniques and exercises.
 *
 * @author Andre Byström, Team Coconut
 * @since: 2024-04-18
 * @version 2.0
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/export")
public class ExportController {
    private final TechniqueExportRepository techniqueExportRepository;
    private final ExerciseExportRepository exerciseExportRepository;
    private final MediaRepository mediaRepository;

    @Autowired
    public ExportController(TechniqueExportRepository techniqueExportRepository,
                            ExerciseExportRepository exerciseExportRepository,
                            MediaRepository mediaRepository) {
        this.techniqueExportRepository = techniqueExportRepository;
        this.exerciseExportRepository = exerciseExportRepository;
        this.mediaRepository = mediaRepository;
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
                                    getVideoUrl(e.getId()),
                                    getTagNames(e.getTags())
                                    );
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

    private String getVideoUrl(Long id) {
        List<Media> media = mediaRepository.findAllMediaById(id);

        if (media.isEmpty()) {
            return "";

        } else {
            return media.get(0).getUrl();
        }

    }
}
