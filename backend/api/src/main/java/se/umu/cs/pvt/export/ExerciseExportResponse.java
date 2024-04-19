package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Response class for exercises. Used to conform to the expected response format.
 *
 * @author Andre Byström, Team Coconut
 * @since: 2024-04-28
 * @version 2.0
 */
public class ExerciseExportResponse {
    private String name;
    private String description;
    private int duration;
    private String videoUrl;
    private List<String> tags;

    public ExerciseExportResponse(String name, String description, int duration,String videoUrl, List<String> tags) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.videoUrl = videoUrl;
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

    public String getVideoUrl() {
        return videoUrl;
    }

    public List<String> getTags() {
        return tags;
    }

}
