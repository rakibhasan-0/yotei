package se.umu.cs.pvt.examination;
import javax.persistence.*;

/**
 * Entity class for the examination_comment table.
 * This class represents comments associated with examination entities.
 * Each comment can be tied to a specific grading, examinee, or technique.
 * @author Team Orange
 */
@Entity
@Table(name = "examination_comment")
public class ExaminationComment{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false,name = "comment_id")
    private Long commentId;

    @Column(nullable = false,name = "grading_id")
    private Long gradingId;

    @Column(nullable = false,name = "examinee_id")
    private Long examineeId;

    @Column(name = "examinee_pair_id")
    private Long examineePairId;

    @Column(name = "technique_name")
    private String techniqueName;

    @Column(name = "comment")
    private String comment;

    /**
     * Constructs a new ExaminationComment with all field values initialized.
     *
     * @param comment_id The identifier for the comment.
     * @param grading_id The identifier for the associated grading.
     * @param examinee_id The identifier for the associated examinee.
     * @param examinee_pair_id Optional identifier for a paired examinee.
     * @param technique_name The name of the technique discussed in the comment.
     * @param comment The text of the comment.
     */
    public ExaminationComment(Long comment_id, Long grading_id, Long examinee_id, Long examinee_pair_id, String technique_name, String comment) {
        this.commentId = comment_id;
        this.gradingId = grading_id;
        this.examineeId = examinee_id;
        this.examineePairId = examinee_pair_id;
        this.techniqueName= technique_name;
        this.comment = comment;
    }

    /**
     * Protected no-args constructor for JPA use only.
     */
    protected ExaminationComment() {
    }

    public Long getCommentId() {
        return commentId;
    }

    public Long getGradingId() {
        return gradingId;
    }

    public Long getExamineeId() {
        return examineeId;
    }

    public Long getExamineePairId() {
        return examineePairId;
    }

    public String getTechniqueName() {
        return techniqueName;
    }

    public String getComment() {
        return comment;
    }
}
