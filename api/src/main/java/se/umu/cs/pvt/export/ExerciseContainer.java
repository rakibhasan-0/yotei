package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Container class for json formatting.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public class ExerciseContainer {
    private List<ExerciseExportResponse> exercises;

    public ExerciseContainer(List<ExerciseExportResponse> exercises) {
        this.exercises = exercises;
    }

    public List<ExerciseExportResponse> getExercises() {
        return exercises;
    }
}
