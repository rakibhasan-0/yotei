package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Response class for techniques.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public class TechniqueExportResponse {
    private String name;
    private String description;
    private List<String> tags;

    public TechniqueExportResponse(String name, String description, List<String> tags) {
        this.name = name;
        this.description = description;
        this.tags = tags;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getTags() {
        return tags;
    }
}
