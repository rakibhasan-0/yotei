package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Examinee - Entity class for the examination_examinee table
 * @author Team granatäpple (c21man && ens20lpn)
 */
@Entity()
@Table(name = "examination_examinee")
public class Examinee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "examinee_id")
    private Long examineeId;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = false, name = "grading_id")
    private Long gradingId;

    /**
     * Data constructor for Examinee.
     * 
     * @param examineeId Id of the examinee.
     * @param name Name of the examinee.
     * @param gradingId The grading id of the examinee.
     */
    public Examinee(Long examineeId, String name, Long gradingId){
        this.examineeId = examineeId;
        this.name = name;
        this.gradingId = gradingId;
    }
    
    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Examinee() {}

    public Long getExamineeId() {
        return examineeId;
    }

    public String getName() {
        return name;
    }

    public Long getGradingId() {
        return gradingId;
    }
}


