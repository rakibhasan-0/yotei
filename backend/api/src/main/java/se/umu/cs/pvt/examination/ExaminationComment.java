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

    @Column(name = "examinee_id")
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
     * @param commentId The identifier for the comment.
     * @param gradingId The identifier for the associated grading.
     * @param examineeId The identifier for the associated examinee.
     * @param examineePairId Optional identifier for a paired examinee.
     * @param techniqueName The name of the technique discussed in the comment.
     * @param comment The text of the comment.
     */
    public ExaminationComment(Long commentId, Long gradingId, Long examineeId, Long examineePairId, String techniqueName, String comment) {
        this.commentId = commentId;
        this.gradingId = gradingId;
        this.examineeId = examineeId;
        this.examineePairId = examineePairId;
        this.techniqueName= techniqueName;
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
