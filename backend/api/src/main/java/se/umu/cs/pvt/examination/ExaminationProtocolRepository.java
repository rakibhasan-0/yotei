package se.umu.cs.pvt.examination;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for the examination protocol repository api. 
 * 
 * @author Orange (dv22rfg)
 */
public interface ExaminationProtocolRepository extends JpaRepository<ExaminationProtocol, Long> {

}