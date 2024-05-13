package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * ExaminationProtocol - Entity class for the examination_protocol table
 * @author Team Orange
 */
@Entity()
@Table(name = "examination_protocol")
public class ExaminationProtocol {

    @Id
    @Column(nullable = false, name = "belt_id")
    private long belt_id;

    @Column(nullable = false, name = "examination_protocol")
    private String examination_protocol;

    /**
     * Data constructor for ExaminationProtocol
     * 
     * @param belt_id The belt id for the examination protocol.
     * @param examination_protocol The json for the String of the examination protocol.  
     */
    public ExaminationProtocol(long belt_id, String examination_protocol) {
        this.belt_id = belt_id;
        this.examination_protocol = examination_protocol;
    }

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationProtocol() {}

    public long getBeltId() {
        return belt_id;
    }

    public String getExaminationProtocol() {
        return examination_protocol;
    }
}
