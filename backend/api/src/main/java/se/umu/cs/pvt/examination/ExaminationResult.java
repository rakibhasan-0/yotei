package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * ExaminationResult- Entity class for the examination_result table
 * @author Orange (dv22rfg)
 */
@Entity
@Table(name = "examination_result")
public class ExaminationResult {
    
    @Id
    @Column(name = "examinee_id")
    private long examineeId;

    @Column(name = "technique_name")
    private String techniqueName;

    @Column(name = "pass")
    private boolean pass;
    
    /**
     * Data constructor for ExaminationResult.
     * 
     * @param examineeId The id of the examinee.
     * @param techniqueName The name of the technique.
     * @param pass Pass or fail of performing the technique.
     */
    public ExaminationResult(long examineeId, String techniqueName, boolean pass){
        this.examineeId = examineeId;
        this.techniqueName = techniqueName;
        this.pass = pass;
    }

     /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationResult() {}

    public long getExaminee_id(){
        return examineeId;
    }

    public String getTechniqueName(){
        return techniqueName;
    }

    public boolean getPass(){
        return pass;
    }
}


