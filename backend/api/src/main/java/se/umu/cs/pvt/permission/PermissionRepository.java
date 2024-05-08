package se.umu.cs.pvt.permission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * A permissoin repository to handle simple crud calls
 * 
 * @author Team Mango (Grupp 4) - 2024-05-08
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long>{
    
}
