package cs.umu.se.pvt.planapi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * JPARepository for Plan
 * @author Calzone
 */

public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByUserId(Long userId);
}