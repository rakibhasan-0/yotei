package se.umu.cs.pvt.examination;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * JPA repository for Grading api. 
 * 
 * @author Pomegranate (c21man && ens20lpn)
 */
public interface GradingRepository extends JpaRepository<Grading, Long> {

}
