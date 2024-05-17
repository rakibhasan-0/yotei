package se.umu.cs.pvt.statistics.gradingprotocol;

import java.util.List;

import se.umu.cs.pvt.belt.BeltRepository;
import se.umu.cs.pvt.statistics.BeltResponse;


public class GradingProtocolDTO {
    
    private String code;
    private String name;
    private BeltResponse belt;
    private List<GradingProtocolCategory> categories;


    public GradingProtocolDTO(String code, String name, BeltResponse belt, List<GradingProtocolCategory> categories){
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

    public List<GradingProtocolCategory> getCategories() {
        return this.categories;
    }
}
