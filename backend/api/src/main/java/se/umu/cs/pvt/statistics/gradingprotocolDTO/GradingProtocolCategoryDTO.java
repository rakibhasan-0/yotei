package se.umu.cs.pvt.statistics.gradingprotocolDTO;

import java.util.ArrayList;
import java.util.List;


public class GradingProtocolCategoryDTO {
    
    private String name;
    private List<GradingProtocolTechinqueDTO> techniques;


    public GradingProtocolCategoryDTO(String name, List<GradingProtocolTechinqueDTO> techniques){
        this.name = name;
        this.techniques = techniques;
    }

    public GradingProtocolCategoryDTO(String name) {
        this.name = name;
        this.techniques = new ArrayList<>();
    }

    public String getName() {
        return this.name;
    }


    public List<GradingProtocolTechinqueDTO> getTechniques() {
        return this.techniques;
    }

    public void addTechqnique(GradingProtocolTechinqueDTO techinque) {
        this.techniques.add(techinque);
    }
}
