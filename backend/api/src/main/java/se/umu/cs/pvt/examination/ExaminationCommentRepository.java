package se.umu.cs.pvt.examination;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for examination comment api. 
 * 
 * @author Orange (dv22rfg)
 */
public interface ExaminationCommentRepository extends JpaRepository<ExaminationComment, Long> {

}