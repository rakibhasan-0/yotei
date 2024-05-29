package se.umu.cs.pvt.examination;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * JPA repository for examination result api. 
 * 
 * @author Orange (dv22rfg)
 */
public interface ExaminationResultRepository extends JpaRepository<ExaminationResult, Long> {
    long countByExamineeIdAndPassTrue(long examineeId);
    long countByExamineeIdAndPassFalse(long examineeId);
    List<ExaminationResult> findByExamineeId(long examineeId);
}