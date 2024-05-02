package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity()
@Table(name = "examination_examinee")
public class Examinee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "examinee_id")
    private Long examinee_id;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = false, name = "grading_id")
    private Long grading_id;


    public Examinee(Long examinee_id, String name, Long grading_id){
        this.examinee_id = examinee_id;
        this.name = name;
        this.grading_id = grading_id;
    }
    
    public Long getExaminee_id() {
        return examinee_id;
    }

    public String getName() {
        return name;
    }

    public Long getGrading_id() {
        return grading_id;
    }

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Examinee() {}

}


