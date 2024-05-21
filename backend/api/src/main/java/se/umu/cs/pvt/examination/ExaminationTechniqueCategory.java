package se.umu.cs.pvt.examination;

import java.util.ArrayList;
import java.util.List;

public class ExaminationTechniqueCategory {
    private String categoryName;
    
    private List<String> techniques;
    
    public ExaminationTechniqueCategory(String categoryName) {
        this.categoryName = categoryName;
        this.techniques = new ArrayList<>();
    }
    
    public List<String> getTechniques() {
        return techniques;
    }
    
    public String getCategoryName() {
        return categoryName;
    }

    public void addTechnique(String technique) {
        techniques.add(technique);
    }

}
