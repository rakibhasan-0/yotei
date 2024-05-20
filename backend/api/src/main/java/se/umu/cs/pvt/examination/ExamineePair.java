package se.umu.cs.pvt.examination;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * ExamineePair - Entity class for the examination_examinee_pair table
 * @author Team Pomegranate (c21man && ens20lpn)
 */
@Entity()
@Table(name = "examination_examinee_pair")
public class ExamineePair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "examinee_pair_id")
    private Long examineePairId;

    @Column(nullable = false, name = "examinee_1_id")
    private Long examinee1Id;

    @Column(name = "examinee_2_id")
    private Long examinee2Id;

    /**
     * Data constructor for ExamineePair.
     * 
     * @param examinee_pair_id Id of the examinee pair.
     * @param examinee_1_id Id of the first examinee.
     * @param examinee_2_id Id of the second examinee.
     */
    public ExamineePair(Long examinee_pair_id, Long examinee_1_id, Long examinee_2_id){
        this.examineePairId = examinee_pair_id;
        this.examinee1Id = examinee_1_id;
        this.examinee2Id = examinee_2_id;
    }
    
    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExamineePair() {}
    
    public Long getExamineePairId() {
        return examineePairId;
    }

    public Long getExaminee1Id() {
        return examinee1Id;
    }

    public Long getExaminee2Id() {
        return examinee2Id;
    }

    // public void Examinee_2_id(Long examinee_2_id) {
    //     this.examinee_2_id = examinee_2_id;
    // }

}
