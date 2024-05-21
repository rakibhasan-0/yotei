package se.umu.cs.pvt.examination;
import javax.persistence.*;
import javax.print.DocFlavor.CHAR_ARRAY;

import se.umu.cs.pvt.belt.Belt;

import java.util.Date;
import java.util.Set;

/**
 * Grading - Entity class for the examination_grading table
 * @author Team Pomegranate (c21man && ens20lpn)
 */
@Entity()
@Table(name = "examination_grading")
public class Grading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "grading_id")
    private Long gradingId;

    @Column(nullable = false, name = "creator_id")
    private Long creatorId;

    @Column(nullable = false, name = "step")
    private int step;

    @Column(nullable = false, name = "created_at")
    private Date createdAt;

    @Column(nullable = false, name = "belt_id")
    private Long beltId;

    @Column(nullable = false, name = "technique_step_num")
    private int techniqueStepNum;

    @Column(nullable = false, name = "title")
    private String title;

    @OneToMany(fetch=FetchType.LAZY, mappedBy = "gradingId")
    private Set<Examinee> examinees;

    public Set<Examinee> getExaminees() {
        return examinees;
    }
    
    /**
     * Data constructor for Grading.
     * 
     * @param grading_id Id of the grading.
     * @param creator_id Id of the creator of the grading.
     * @param belt_id Id of the belt to grade.
     * @param step Incdicates the step of the grading.(1-3)
     * @param technique_step_num Keeps track of the current technique.
     * @param created_at The date of the grading.
     * @param title The title of the grading
     */

    public Grading(Long gradingId, Long creatorId, Long beltId,int step, int techniqueStepNum,Date createdAt, String title) {
        this.gradingId = gradingId;
        this.creatorId = creatorId;
        this.beltId = beltId;
        this.step = step;
        this.techniqueStepNum = techniqueStepNum;
        this.createdAt = createdAt;
        this.title = title;

    }
    
    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Grading() {}
    
    public Long getGradingId() {
        return gradingId;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public int getStep() {
        return step;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Long getBeltId() {
        return beltId;
    }

    public int getTechniqueStepNum() {
        return techniqueStepNum;
    }

    public String getTitle() {
      return title;
    }
}
