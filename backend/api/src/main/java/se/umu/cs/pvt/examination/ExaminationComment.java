package se.umu.cs.pvt.examination;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity()
@Table(name = "examination_comment")
public class ExaminationComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "comment_id")
    private Long comment_id;

    @Column(nullable = false, name = "grading_id")
    private Long grading_id;
    
    @Column(nullable = false, name = "examinee_id")
    private Long examinee_id;

    @Column(nullable = false, name = "examinee_pair_id")
    private Long examinee_pair_id;

    @Column(nullable = false, name = "technique_id")
    private Long technique_id;

    @Column(nullable = false, name = "comment")
    private String comment;


    public ExaminationComment(Long comment_id, Long grading_id, Long examinee_id, Long examinee_pair_id, Long technique_id, String comment){
        this.comment_id = comment_id;
        this.grading_id = grading_id;
        this.examinee_id = examinee_id;
        this.examinee_pair_id = examinee_pair_id;
        this.technique_id = technique_id;
        this.comment = comment;
    }


    public Long getComment_id() {
        return comment_id;
    }

    public Long getGrading_id() {
        return grading_id;
    }

    public Long getExaminee_id() {
        return examinee_id;
    }

    public Long getExaminee_pair_id() {
        return examinee_pair_id;
    }

    public Long getTechnique_id() {
        return technique_id;
    }

    public String getComment() {
        return comment;
    }
    
    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExaminationComment() {}
}   
