package se.umu.cs.pvt.belt;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "technique_to_belt")
public class TechniqueBelt {
    @EmbeddedId
    private TechniqueBeltPk id;

    @Column(nullable = false, name = "belt_id", insertable = false, updatable = false)
    private Long beltId;

    @Column(nullable = false, name = "technique_id", insertable = false, updatable = false)
    private Long techniqueId;

    protected TechniqueBelt() {
    }

    /**
     * No-args constructor required by JPA spec
     * This one is protected since it shouldn't be used directly
     */

    public TechniqueBelt(Long beltId, Long techniqueId) {
        this.beltId = beltId;
        this.techniqueId = techniqueId;
        this.id = new TechniqueBeltPk(beltId, techniqueId);
    }

    public Long getBeltId() {
        return beltId;
    }

    public Long getTechniqueId() {
        return techniqueId;
    }

    @Embeddable
    public static class TechniqueBeltPk implements Serializable {
        @Column(name = "belt_id")
        private long beltId;

        @Column(name = "technique_id")
        private long techniqueId;

        protected TechniqueBeltPk() {

        }

        public TechniqueBeltPk(long beltId, long techniqueId) {
            this.beltId = beltId;
            this.techniqueId = techniqueId;
        }
    }
}
