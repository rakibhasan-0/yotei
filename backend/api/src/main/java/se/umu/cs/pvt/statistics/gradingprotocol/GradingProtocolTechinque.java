package se.umu.cs.pvt.statistics.gradingprotocol;

public class GradingProtocolTechinque {
    private String name;
    private Long id;
    private Long count;

    public GradingProtocolTechinque(String name, Long id) {
        this.name = name;
        this.id = id;
        this.count = 0L;
    }
 
    public String getName() {
        return this.name;
    }

    public Long getId() {
        return this.id;
    }

    public Long getCount() {
        return this.count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
