package se.umu.cs.pvt.role;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for the Role class enabling simple CRUD methods
 * 
 * @author Team Mango (Grupp 4) - 2024-05-21
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{
    boolean existsByRoleName(String roleName);

    Optional<Role> findByRoleName(String roleName);
}
