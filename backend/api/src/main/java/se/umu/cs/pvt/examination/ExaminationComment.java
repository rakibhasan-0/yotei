package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * ExaminationComment - Entity class for the examination_comment table
 * @author Team Orange (oi22nlg)
 */
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

    @Column(nullable = true, name = "examinee_pair_id")
    private Long examinee_pair_id;

    @Column(nullable = true, name = "technique_name")
    private String technique_name;

    @Column(nullable = true, name = "comment")
    private String comment;

    /**
     * Data constructor for ExaminationComment.l
     * 
     * @param comment_id The id of the created comment.
     * @param grading_id The id of the grading (for group comments).
     * @param examinee_id The id of the examinee (comments for specific examinees).
     * @param examinee_pair_id The id of the examinee pair (pair comments).
     * @param technique_name The id of the technique the comment is written on.
     * @param comment The comment text.
     */
    public ExaminationComment(Long comment_id, Long grading_id, Long examinee_id, Long examinee_pair_id, String technique_name, String comment) {
        this.comment_id = comment_id;
        this.grading_id = grading_id;
        this.examinee_id = examinee_id;
        this.examinee_pair_id = examinee_pair_id;
        this.technique_name = technique_name;
        this.comment = comment;
    }

    /**
    * no-args constructor required by JPA spec
    * this one is protected since it shouldn't be used directly
    */
    protected ExaminationComment() {
    }

    public Long get_comment_id() {
        return comment_id;
    }

    public Long get_grading_id() {
        return grading_id;
    }

    public Long get_examinee_id() {
        return examinee_id;
    }

    public Long get_examinee_pair_id() {
        return examinee_pair_id;
    }

    public String get_technique_name() {
        return technique_name;
    }

    public String get_comment() {
        return comment;
    }
}