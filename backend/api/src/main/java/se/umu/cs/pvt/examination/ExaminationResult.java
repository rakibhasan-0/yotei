package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * ExaminationResult- Entity class for the examination_result table
 * @author Orange (dv22rfg)
 */
@Entity()
@Table(name = "examination_result")
public class ExaminationResult {
    @Id
    @Column(nullable = false, name = "examinee_id")
    private Long examinee_id;

    @Column(nullable = false, name = "technique_name")
    private String technique_name;

    @Column(nullable = false, name = "pass")
    private Boolean pass;
    
    /**
     * Data constructor for ExaminationResult.
     * 
     * @param examinee_id The id of the examinee.
     * @param technique_name The name of the technique.
     * @param pass Pass or fail of performing the technique.
     */
    public ExaminationResult(Long examinee_id, String technique_name, Boolean pass){
        this.examinee_id = examinee_id;
        this.technique_name = technique_name;
        this.pass = pass;
    }

     /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationResult() {}

    public long getExaminee_id(){
        return examinee_id;
    }

    public String getTechnique_name(){
        return technique_name;
    }

    public boolean getPass(){
        return pass;
    }
}