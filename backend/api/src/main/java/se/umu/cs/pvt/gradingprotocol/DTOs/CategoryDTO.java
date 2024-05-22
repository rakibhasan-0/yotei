package se.umu.cs.pvt.gradingprotocol.DTOs;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.util.List;

/**
 * Data Transfer Object for formatting the category field in JSON response for grading protocol.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-20
 */
@JsonPropertyOrder({ "category_name", "techniques" })
public class CategoryDTO {

    private String categoryName;
    private List<TechniqueDTO> techniques;


    public CategoryDTO(String name, List<TechniqueDTO> techniques) {
        this.categoryName = name;
        this.techniques = techniques;
    }

    public CategoryDTO(String name) {
        this.categoryName = name;
    }

    public String getCategory_name() {
        return categoryName;
    }

    public List<TechniqueDTO> getTechniques() {
        return techniques;
    }

    public void setTechniques(List<TechniqueDTO> techinques) {
        this.techniques = techinques;
    }
}
