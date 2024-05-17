package se.umu.cs.pvt.examination;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * JPA repository for Examinee api. 
 * 
 * @author Pomegranate (c21man && ens20lpn)
 */
public interface ExamineeRepository extends JpaRepository<Examinee, Long> {
    
    public List<Examinee> findByGradingId(Long gradingId);

}

