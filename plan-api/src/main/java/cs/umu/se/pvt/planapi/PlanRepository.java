package cs.umu.se.pvt.planapi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * JPARepository for Plan
 * @author Calzone (Doc:Griffin c20wnn)
 * JPARepository is used for managing the data in a Spring Boot Application.
 *  JPARepository contains the APIs for basic CRUD operations, the APIS for pagination, and the APIs for sorting.
 */

public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByUserId(Long userId);
}