package se.umu.cs.pvt.examination;
import javax.persistence.*;
import java.util.Date;


@Entity()
@Table(name = "examination_grading")
public class Grading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "grading_id")
    private Long grading_id;

    @Column(nullable = false, name = "creator_id")
    private Long creator_id;

    @Column(nullable = false, name = "step")
    private int step;

    @Column(nullable = false, name = "created_at")
    private Date created_at;

    @Column(nullable = false, name = "belt_id")
    private Long belt_id;

    @Column(nullable = false, name = "technique_step_num")
    private int technique_step_num;


    public Grading(Long grading_id, Long creator_id, int step, Date created_at, Long belt_id, int technique_step_num) {
        this.grading_id = grading_id;
        this.creator_id = creator_id;
        this.step = step;
        this.created_at = created_at;
        this.belt_id = belt_id;
        this.technique_step_num = technique_step_num;
    }

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Grading() {}


    public Long getGrading_id() {
        return grading_id;
    }

    public Long getCreator_id() {
        return creator_id;
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
