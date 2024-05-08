package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * ExaminationResult- Entity class for the examination_result table
 * @author Orange (dv22rfg)
 */
@Entity()
@Table(name = "examination_result")
public class ExaminationResult {

    @Column(nullable = false, name = "examinee_id")
    private Long examineeId;

    @Column(nullable = false, name = "technique_name")
    private String techniqueName;

    @Column(nullable = false, name = "pass")
    private Boolean pass;
    
    /**
     * Data constructor for ExaminationResult.
     * 
     * @param examineeId The id of the examinee.
     * @param techniqueName The name of the technique.
     * @param pass Pass or fail of performing the technique.
     */
    public ExaminationResult(Long examineeId, String techniqueName, Boolean pass){
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