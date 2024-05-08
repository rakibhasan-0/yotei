package se.umu.cs.pvt.role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
/**
 * Main class for handling login information and transactions with the database.
 * @author Team Mango (2024-05-08)
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/roles")
public class RoleController {
	
	/**
     * CRUDRepository makes connections with the api possible.
     */
	private final RoleRepository repository;

    /**
     * Constructor for the LoginController object.
     * @param repository Autowired
     */
    @Autowired
    public RoleController(RoleRepository repository) {
        this.repository = repository;

    }

    /**
     * (GET) Returns all the roles.
     * @return HTTP status code and body, where body could be a message or the roles.
     */
    @GetMapping("")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> result = repository.findAll();
		
        if (result == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        } else if (result.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (GET) Returns a specific role.
     *
     * @param roleId The id of the role to be returned.
     * @return Returned either HTTP-request or the role if it goes well.
     */
    @GetMapping("/{role_id}")
    public ResponseEntity<Role> getRole(@PathVariable("role_id") Long roleId) {

        if (roleId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Role> role = repository.findById(roleId);
        if (role.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(role.get(), HttpStatus.OK);
    }

    /**
     * (POST) Method for creating a new role.
     * @param roleToAdd Body with role info to be added
     * @return A response with either the newly created role or an error message.
     */
    @PostMapping("")
    public ResponseEntity<Role> createNewRole(@RequestBody Role roleToAdd) {
        if (roleToAdd.getRoleName().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        repository.save(roleToAdd);

        return new ResponseEntity<>(roleToAdd, HttpStatus.OK);
    }

}
