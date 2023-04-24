package se.umu.cs.pvt.user;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Interface for handling SQL transactions which may be empty.
 * @author Team Hot-Pepper (G7)
 */
@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    /**
     * Finds the user by a give name in the database (If there exist a user).
     * If not, an empty response is returned.
     * @param username  The username for the user
     * @return The User object with the given username
     */
    Optional<User> findUserByUsername(String username);

    List<UserShort> findAllProjectedBy();
}
