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
<<<<<<< HEAD
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "result_id")
    private Long result_id;

=======
    @Id 
>>>>>>> 04cb9d8fb2d3efdc41aba673340b667de94121b8
    @Column(nullable = false, name = "examinee_id")
    private Long examinee_id;

    @Column(nullable = false, name = "technique_name")
    private String technique_name;

    @Column(nullable = true, name = "pass")
    private Boolean pass;
    
    /**
     * Data constructor for ExaminationResult.
     * 
     * @param result_id The id of the examination result.
     * @param examinee_id The id of the examinee.
     * @param technique_name The name of the technique.
     * @param pass Pass or fail of performing the technique.
     */
    public ExaminationResult(Long result_id, Long examinee_id, String technique_name, Boolean pass){
        this.result_id = result_id;
        this.examinee_id = examinee_id;
        this.technique_name = technique_name;
        this.pass = pass;
    }

     /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationResult() {}

    public Long getResult_id(){
        return result_id;
    }

    public Long getExaminee_id(){
        return examinee_id;
    }

    public String getTechnique_name(){
        return technique_name;
    }

    public boolean getPass(){
        return pass;
    }

    public void setPass(Boolean status) {
        pass = status;
    }
}