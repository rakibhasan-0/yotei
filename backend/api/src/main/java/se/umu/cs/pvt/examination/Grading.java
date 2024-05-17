package se.umu.cs.pvt.examination;
import javax.persistence.*;

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
    private Date created_at;

    @Column(nullable = false, name = "belt_id")
    private Long belt_id;

    @Column(nullable = false, name = "technique_step_num")
    private int technique_step_num;

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
     */
    public Grading(Long grading_id, Long creator_id, Long belt_id,int step, int technique_step_num,Date created_at) {
        this.gradingId = grading_id;
        this.creatorId = creator_id;
        this.belt_id = belt_id;
        this.step = step;
        this.technique_step_num = technique_step_num;
        this.created_at = created_at;
    }
    
    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Grading() {}
    
    public Long getGrading_id() {
        return gradingId;
    }

    public Long getCreator_id() {
        return creatorId;
    }

    public int getStep() {
        return step;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public Long getBelt_id() {
        return belt_id;
    }

    public int getTechnique_step_num() {
        return technique_step_num;
    }
}
