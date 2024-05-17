package se.umu.cs.pvt.examination;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * JPA repository for examination result api. 
 * 
 * @author Orange (dv22rfg)
 */
public interface ExaminationResultRepository extends JpaRepository<ExaminationResult, Long> {
    long countByExamineeId(Long examineeId);

}