package se.umu.cs.pvt.examination;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for examination comment api. 
 * 
 * @author Orange (dv22rfg, c19jen)
 */
public interface ExaminationCommentRepository extends JpaRepository<ExaminationComment, Long> {

    List<ExaminationComment> findByExamineePairIdAndTechniqueName(Long examineePairId, String techniqueName);
    List<ExaminationComment> findByExamineeId (Long examineeId);
    List<ExaminationComment> findByExamineePairId (Long examineePairId);
    List<ExaminationComment> findByGradingIdAndExamineeIdIsNullAndExamineePairIdIsNull(Long gradingId);
    List<ExaminationComment> findByExamineeIdAndTechniqueName(Long examineeId, String techniqueName);
    List<ExaminationComment> findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(Long gradingId, String techniqueName);

}