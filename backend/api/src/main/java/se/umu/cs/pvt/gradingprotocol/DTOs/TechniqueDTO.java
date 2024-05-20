package se.umu.cs.pvt.gradingprotocol.DTOs;

public class TechniqueDTO {
    private String text;

    public TechniqueDTO(Integer step, String text) {
        this.text = step.toString() + ". " + text;
    }

    public String getText() {
        return text;
    }

}
