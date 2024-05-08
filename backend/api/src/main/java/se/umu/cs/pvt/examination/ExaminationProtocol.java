package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity()
@Table(name = "examination_protocol")
public class ExaminationProtocol {

    @Id
    @Column(nullable = false, name = "belt_id")
    private int belt_id;

    @Column(nullable = false, name = "examination_protocol")
    private String examination_protocol;

    public ExaminationProtocol(int belt_id, String examination_protocol) {
        this.belt_id = belt_id;
        this.examination_protocol = examination_protocol;
    }

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationProtocol() {}

    public int getBeltId() {
        return belt_id;
    }

    public String getExaminationProtocol() {
        return examination_protocol;
    }
}
