package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Container class for json formatting.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public class ExerciseContainer {
    private List<ExerciseExport> exercises;

    public ExerciseContainer(List<ExerciseExport> exercises) {
        this.exercises = exercises;
    }

    public List<ExerciseExport> getExercises() {
        return exercises;
    }
}
