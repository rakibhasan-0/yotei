package se.umu.cs.pvt.permission;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
