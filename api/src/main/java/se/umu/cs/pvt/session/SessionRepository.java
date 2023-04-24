package se.umu.cs.pvt.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * JPA repository for session api. 
 * 
 * @author Hawaii (Doc: Griffins c20jjs)
 */
public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("select s from Session as s where s.plan = :id and  s.date >= :startDate")
    List<Session> findAllByPlanAfterGivenDate(Long id, LocalDate startDate);

    List<Session> findAllByPlan(Long id);

    @Transactional
    void deleteAllByPlan(Long id);
}
