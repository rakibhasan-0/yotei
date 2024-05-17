package se.umu.cs.pvt.statistics.gradingprotocol;

import java.util.List;


public class GradingProtocolCategory {
    
    private String name;
    private List<GradingProtocolTechinque> techniques;


    public GradingProtocolCategory(String name, List<GradingProtocolTechinque> techniques){
        this.name = name;
        this.techniques = techniques;
    }

    public String getName() {
        return this.name;
    }

    public List<GradingProtocolTechinque> getTechniques() {
        return this.techniques;
    }
}
