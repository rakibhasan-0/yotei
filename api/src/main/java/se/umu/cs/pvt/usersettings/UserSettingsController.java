package se.umu.cs.pvt.usersettings;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Collections;
import java.util.List;

/**
 * This is the UserSettingsController class for getting, inserting and updating the user settings
 *
 * @author Group 1 - Quattro Formaggio
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/usersettings")
public class UserSettingsController {

    private UserSettingsRepository userSettingsRepository;
    private UserToPlanRepository userToPlanRepository;

    @Autowired
    public UserSettingsController(UserSettingsRepository userSettingsRepository, UserToPlanRepository userToPlanRepository) {
        this.userSettingsRepository = userSettingsRepository;
        this.userToPlanRepository = userToPlanRepository;
    }

    /**
     * Get all user settings from the database
     *
     * @return all user settings
     */
    @GetMapping("/all")
    public Object getAllSettings() {
        List<UserSettings> settingsList = userSettingsRepository.findAll();

        if (settingsList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return settingsList;
    }

    /**
     * Get settings of user with specified id
     *
     * @param id the id to get settings from
     * @return the settings if possible, otherwise a http response not found
     */
    @GetMapping("/{id}")
    public Object getUserSettings(@PathVariable("id") Long id) {
        UserSettings userSettings = userSettingsRepository.getById(id);

        return userSettings;
    }

    /**
     * Adds user settings to the database
     *
     * @param toAdd the settings to add
     * @return a http response
     */
    @PostMapping("/add")
    public ResponseEntity<UserSettings> postExercise(@RequestBody UserSettings toAdd) {

        try {
            userSettingsRepository.save(toAdd);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * Updates user settings in the database
     *
     * @param toUpdate the settings to update
     * @return an http response, ok if successful and bad request otherwise
     */
    @PutMapping("/update")
    public ResponseEntity<UserSettings> updateExercise(@RequestBody UserSettings toUpdate) {

        if (userSettingsRepository.findById(toUpdate.getUser_id()).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        userSettingsRepository.save(toUpdate);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Gets the plan settings from an user id.
     * @param user_id The id of the user.
     * @return The plan id's.
     */
    @GetMapping("/getUserToPlan/{user_id}")
    public Object postUserPlanSetting(@PathVariable("user_id") int user_id) {
            List<Long> utps = userToPlanRepository.findAllById(user_id);
        if (utps.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return utps;
    }

    /**
     * Adds the user with a plan id saved setting.
     * @param utps Class of UserToPlan to save to setting.
     * @return Response entity of failure or success.
     */
    @PostMapping("/addUserToPlan")
    public Object postUserPlanSetting(@RequestBody UserToPlan utps) {
        UserToPlan utps2 = userToPlanRepository.findByIdAndPlan(utps.getUser_id(), utps.getPlan_id());
        if (utps2 != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        userToPlanRepository.save(utps);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
