package se.umu.cs.pvt.gradingprotocol.DTOs;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * Data Transfer Object for formatting the GradingProtocol field in JSON response for grading protocol.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-20
 */
@JsonPropertyOrder({ "examination_protocol", "categories" })
public class GradingProtocolDTO {
    
    private ExaminationProtocolDTO examinationProtocolDTO;
    private List<CategoryDTO> categories;

    public GradingProtocolDTO(String code, String name, List<CategoryDTO> categories) {
        this.examinationProtocolDTO = new ExaminationProtocolDTO(code, name);
        this.categories = categories;
    }

    public ExaminationProtocolDTO getExamination_protocol() {
        return this.examinationProtocolDTO;
    }

    public List<CategoryDTO> getCategories() {
        return categories;
    }
}
