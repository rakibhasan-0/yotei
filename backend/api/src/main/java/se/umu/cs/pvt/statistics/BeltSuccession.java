package se.umu.cs.pvt.statistics;


import javax.persistence.*;

import se.umu.cs.pvt.belt.Belt;

import java.io.Serializable;

@Entity
@Table(name = "belt_succession")
public class BeltSuccession implements Serializable {
    @Id
    @Column(name = "belt_id", nullable = false)
    private Long beltId;

    @Id
    @Column(name = "next_belt_id", nullable = false)
    private Long nextBeltId;

    @OneToOne
    @JoinColumn(name = "belt_id", referencedColumnName = "belt_id", insertable = false, updatable = false)
    private Belt belt;

    @OneToOne
    @JoinColumn(name = "next_belt_id", referencedColumnName = "belt_id", insertable = false, updatable = false)
    private Belt nextBelt;

    protected BeltSuccession() {}

    public BeltSuccession(Long beltId, Long nextBeltId) {
        this.beltId = beltId;
        this.nextBeltId = nextBeltId;
    }

    public Long getBeltId() {
        return beltId;
    }

    public Long getNextBeltId() {
        return nextBeltId;
    }

    public Belt getBelt() {
        return belt;
    }

    public Belt getNextBelt() {
        return nextBelt;
    }
}
    