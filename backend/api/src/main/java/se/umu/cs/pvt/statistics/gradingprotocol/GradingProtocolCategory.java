package se.umu.cs.pvt.statistics.gradingprotocol;

import java.util.List;

import se.umu.cs.pvt.statistics.StatisticsResponse;

public class GradingProtocolCategory {
    
    private String name;
    private List<StatisticsResponse> techniques;


    public GradingProtocolCategory(String name, List<StatisticsResponse> techniques){
        this.name = name;
        this.techniques = techniques;
    }

    public String getName() {
        return this.name;
    }

    public List<StatisticsResponse> getTechniques() {
        return this.techniques;
    }
}
