package se.umu.cs.pvt.role;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for the Role class enabling simple CRUD methods
 * 
 * @author Team Mango (Grupp 4) - 2024-05-08
 */
@Repository
public interface RoleRepository extends CrudRepository<Role, Long>{
    
}
