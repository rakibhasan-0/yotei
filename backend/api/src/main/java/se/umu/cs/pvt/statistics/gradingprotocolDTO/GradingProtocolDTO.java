package se.umu.cs.pvt.statistics.gradingprotocolDTO;

import java.util.List;

import se.umu.cs.pvt.statistics.BeltResponse;


public class GradingProtocolDTO {
    
    private String code;
    private String name;
    private BeltResponse belt;
    private List<GradingProtocolCategoryDTO> categories;


    public GradingProtocolDTO(String code, String name, BeltResponse belt, List<GradingProtocolCategoryDTO> categories){
        this.code = code;
        this.name = name;
        this.belt = belt;
        this.categories = categories;
    }

    public String getCode() {
        return this.code;
    }

    public String getName() {
        return this.name;
    }

    public BeltResponse getBelt() {
        return this.belt;
    }

    public List<GradingProtocolCategoryDTO> getCategories() {
        return this.categories;
    }
}
