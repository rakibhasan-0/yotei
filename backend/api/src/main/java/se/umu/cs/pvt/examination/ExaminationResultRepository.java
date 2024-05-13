package se.umu.cs.pvt.examination;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for examination result api. 
 * 
 * @author Orange (dv22rfg)
 */
public interface ExaminationResultRepository extends JpaRepository<ExaminationResult, Long> {

}