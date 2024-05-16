package se.umu.cs.pvt.examination;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * JPA repository for examination comment api. 
 * 
 * @author Orange (dv22rfg)
 */
public interface ExaminationCommentRepository extends JpaRepository<ExaminationComment, Long> {

    @Query("SELECT * FROM examination_comment AS ec WHERE ec.examinee_pair_id = :examineePairId AND ec.technique_name = :techniqueName")
    List<ExaminationComment> findByPairIdAndTechniqueName(Long examineePairId, String techniqueName);

}