package se.umu.cs.pvt.examination;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for examination comment api. 
 * 
 * @author Orange (dv22rfg)
 */
public interface ExaminationCommentRepository extends JpaRepository<ExaminationComment, Long> {

    List<ExaminationComment> findByExamineePairIdAndTechniqueName(Long examineePairId, String techniqueName);

    List<ExaminationComment> findByExamineeIdAndTechniqueName(Long examineeId, String techniqueName);
    List<ExaminationComment> findByGradingIdAndTechniqueNameAndExamineeIdIsNullAndExamineePairIdIsNull(Long gradingId, String techniqueName);

}