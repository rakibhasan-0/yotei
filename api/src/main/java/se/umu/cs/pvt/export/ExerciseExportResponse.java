package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Response class for exercises.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public class ExerciseExportResponse {
    private String name;
    private String description;
    private int duration;
    private List<String> tags;


    public ExerciseExportResponse(String name, String description, int duration, List<String> tags) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.tags = tags;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getDuration() {
        return duration;
    }

    public List<String> getTags() {
        return tags;
    }
}
