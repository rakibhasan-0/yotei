package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "result_id")
    private Long resultId;

    @Column(nullable = false, name = "examinee_id")
    private Long examineeId;

    @Column(nullable = false, name = "technique_name")
    private String techniqueName;

    @Column(nullable = true, name = "pass")
    private Boolean pass;
    
    /**
     * Data constructor for ExaminationResult.
     * 
     * @param resultId The id of the examination result.
     * @param examineeId The id of the examinee.
     * @param techniqueName The name of the technique.
     * @param pass Pass or fail of performing the technique.
     */
    public ExaminationResult(Long resultId, Long examineeId, String techniqueName, Boolean pass){
        this.resultId = resultId;
        this.examineeId = examineeId;
        this.techniqueName = techniqueName;
        this.pass = pass;
    }

     /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationResult() {}

    public Long getResultId(){
        return resultId;
    }

    public Long getExamineeId(){
        return examineeId;
    }

    public String getTechnique_name(){
        return techniqueName;
    }

    public Boolean getPass(){
        return pass;
    }

    public void setPass(Boolean status) {
        pass = status;
    }
}