package se.umu.cs.pvt.statistics.gradingprotocolDTO;

import java.util.ArrayList;
import java.util.List;

/**
 * Used to represent grading protocol category statistics response.
 * 
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-17
 */
public class GradingProtocolCategoryDTO {
    
    private String name;
    private List<GradingProtocolTechinqueDTO> techniques;

    /**
     * Constructor for GradingProtocolCategoryDTO.
     *
     * @param name name of the category.
     * @param techniques the techniques contained in the category
     * @return new GradingProtocolCategoryDTO
     */
    public GradingProtocolCategoryDTO(String name, List<GradingProtocolTechinqueDTO> techniques){
        this.name = name;
        this.techniques = techniques;
    }

    /**
     * Constructor for GradingProtocolCategoryDTO with empty list of techniques.
     *
     * @param name name of the category.
     * @return new GradingProtocolCategoryDTO
     */
    public GradingProtocolCategoryDTO(String name) {
        this.name = name;
        this.techniques = new ArrayList<>();
    }
    
    /**
     * Public getter for private property name
     * @return name of the category
     */
    public String getName() {
        return this.name;
    }

    /**
     * Public getter for private property techniques.
     * NOTE: the order of the techniques are as specified by the protocol.
     * @return the techniques associated with a technique.
     */
    public List<GradingProtocolTechinqueDTO> getTechniques() {
        return this.techniques;
    }

    /**
     * Adds a technique to the list of techniques.
     * 
     * @param technique to add
     */
    public void addTechqnique(GradingProtocolTechinqueDTO techinque) {
        this.techniques.add(techinque);
    }
}
