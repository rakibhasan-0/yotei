package se.umu.cs.pvt.gradingprotocol.DTOs;

/**
 * Data Transfer Object for formatting the belt ExaminationProtocol in JSON response for grading protocol.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-20
 */
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
