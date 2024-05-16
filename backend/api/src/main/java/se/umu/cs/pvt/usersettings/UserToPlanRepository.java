package se.umu.cs.pvt.usersettings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Interface for the UserPlanRepository.
 */
@Repository
public interface UserToPlanRepository extends JpaRepository<UserToPlan, Long>{
    @Query("SELECT us.plan_id FROM UserToPlan as us WHERE us.user_id=:user_id")
    List<Long> findAllById(long user_id);

    @Query("SELECT us FROM UserToPlan as us WHERE us.user_id =:user_id AND us.plan_id=:plan_id")
    UserToPlan findByIdAndPlan(long user_id, long plan_id);
}
