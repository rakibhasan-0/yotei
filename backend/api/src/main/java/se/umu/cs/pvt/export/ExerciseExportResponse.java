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
    private List<String> videoUrls;
    private List<String> tags;

    public ExerciseExportResponse(String name, String description, int duration, List<String> videoUrls, List<String> tags) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.videoUrls = videoUrls;
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

    public List<String> getVideoUrls() {
        return videoUrls;
    }

    public List<String> getTags() {
        return tags;
    }

}
