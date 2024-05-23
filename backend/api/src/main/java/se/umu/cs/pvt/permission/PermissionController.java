package se.umu.cs.pvt.permission;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

/**
 * Controller for permission endpoints.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-08
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/permissions")
public class PermissionController {
    private final PermissionRepository repository;

    @Autowired
    public PermissionController(PermissionRepository repo) {
        this.repository = repo;
    }

    /**
     * (GET) Method for getting all permissions
     * @return All permissions. A status code will tell if the list was not found, is empty, or succeeded normally.
     */
    @GetMapping("")
    public ResponseEntity<List<Permission>> getPermissions() {
        List<Permission> result = repository.findAll();
        if (result == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (result.isEmpty()) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (PUT) Method for updating a single permission through a specific id.
     * @return The permission or an error message.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Permission> updatePermissionFromId(@PathVariable ("id") Long id, @RequestBody Permission updatedPermission) {
        Optional<Permission> permission = repository.findById(id);
        if (!permission.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Permission newPermission = permission.get();
        newPermission.setPermissionName(updatedPermission.getPermissionName());
        newPermission.setPermissinDescription(updatedPermission.getPermissionDescription());

        repository.save(newPermission);

        return new ResponseEntity<>(newPermission, HttpStatus.OK);
    }

    /**
     * (GET) Method for getting a single permission based on its id.
     * @param id The permission id
     * @return A single permission or an error message
     */
    @GetMapping("/{id}")
    public ResponseEntity<Permission> getPermissionFromId(@PathVariable ("id") Long id) {
        Optional<Permission> permission = repository.findById(id);
        if (permission.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(permission.get(), HttpStatus.OK);
    }
}
