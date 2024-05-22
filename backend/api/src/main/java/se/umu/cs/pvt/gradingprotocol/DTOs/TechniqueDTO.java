package se.umu.cs.pvt.gradingprotocol.DTOs;

/**
 * Data Transfer Object for formatting the technique field in JSON response for grading protocol.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-20
 */
public class TechniqueDTO {
    private String text;

    public TechniqueDTO(Integer step, String text) {
        this.text = step.toString() + ". " + text;
    }

    public String getText() {
        return text;
    }

}
