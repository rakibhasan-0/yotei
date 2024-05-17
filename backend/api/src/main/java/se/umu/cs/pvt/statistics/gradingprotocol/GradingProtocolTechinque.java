package se.umu.cs.pvt.statistics.gradingprotocol;

public class GradingProtocolTechinque {
    private String name;
    private Long id;

    public GradingProtocolTechinque(String name, Long id) {
        this.name = name;
        this.id = id;
    }
 
    public String getName() {
        return this.name;
    }

    public Long getId() {
        return this.id;
    }
}
