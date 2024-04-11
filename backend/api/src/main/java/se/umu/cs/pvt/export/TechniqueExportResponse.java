package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Response class for techniques. Used to conform to the expected response format.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public class TechniqueExportResponse {
    private String name;
    private String description;
    private List<String> tags;
    private List<Long> belts;

    public TechniqueExportResponse(String name, String description, List<String> tags, List<Long> belts) {
        this.name = name;
        this.description = description;
        this.tags = tags;
        this.belts = belts;
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

    public List<Long> getBelts() { return belts; }
}
