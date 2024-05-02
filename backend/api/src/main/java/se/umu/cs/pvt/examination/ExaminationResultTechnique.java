package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity()
@Table(name = "examination_result_technique")

public class ExaminationResultTechnique {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "examination_result_technique_id")
    private Long examination_result_technique_id;

    
    @Column(nullable = false, name = "examinee_id")
    private Long examinee_id;

    @Column(nullable = false, name = "technique_id_json")
    private String technique_id_json;

    @Column(nullable = false, name = "pass")
    private Long pass;


    public ExaminationResultTechnique(Long examination_result_technique_id, Long examinee_id, String technique_id_json, Long pass){
        this.examination_result_technique_id = examination_result_technique_id;
        this.examinee_id = examinee_id;
        this.technique_id_json = technique_id_json;
        this.pass = pass;
    }


    public Long getExamination_result_technique_id() {
        return examination_result_technique_id;
    }

    public Long getExaminee_id() {
        return examinee_id;
    }

    public String getTechnique_id_json() {
        return technique_id_json;
    }

    public Long getPass() {
        return pass;
    }

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationResultTechnique() {}

}
