package se.umu.cs.pvt.gradingprotocol.DTOs;

public class ExaminationProtocolDTO {
    private String code;
    private String color;

    public ExaminationProtocolDTO(String code, String color) {
        this.code = code;
        this.color = color;
    }

    public String getCode() {
        return code;
    }

    public String getColor() {
        return color;
    }

}
