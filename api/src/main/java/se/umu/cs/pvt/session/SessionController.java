package se.umu.cs.pvt.session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.swing.text.html.HTML;

/**
 * Class for handling requests to the session api.
 * 
 * Contains two depricated methods, 'addRepeating' and 'createSessions' 
 * that have been replaced by 'addList'. 
 *
 * @author Hawaii (Doc: Griffins c20jjs)
 */
@RestController
@RequestMapping(path = "/api/session")
public class SessionController {
    private final SessionRepository sessionRepository;

    @Autowired
    public SessionController(SessionRepository sessionRepository){
        this.sessionRepository = sessionRepository;
    }

     /**
     * Get session by id
     * 
     * @param id The session id.
     * @return HTTP-status code and the list of sessions. 
     */
    @GetMapping("/get")
    public ResponseEntity<Optional<Session>> get(@RequestParam Long id) {
        if(sessionRepository.findById(id).isEmpty()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } 
        
        return new ResponseEntity<>(sessionRepository.findById(id), HttpStatus.OK);
        
    }

    /**
     * Adds a single session to the database.
     * 
     * @param session Object mapped session from request body.
     * @return Response containing the added session and an HTTP code.
     */
    @PostMapping("/add")
    public ResponseEntity<Session> add(@RequestBody Session session){
        if(session.getId() != null || session.invalidFormat())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(sessionRepository.save(session), HttpStatus.OK);
    }

    /**
     * Adds a list of sessions into the database.
     * 
     * @param sessions A JSON list of sessions with all required fields excluding id.
     * @return The added sessions including id:s.
     */
    @PostMapping("/addList")
    public ResponseEntity<List<Session>> addList(@RequestBody List<Session> sessions){

        if(sessions.isEmpty() || sessions.stream().anyMatch(session -> session.getId() == null || session.invalidFormat()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(sessionRepository.saveAll(sessions), HttpStatus.CREATED);
    }

    /**
     * Delete a session given an id.
     * 
     * @param id The id of the session that is to be deleted. 
     * @return HTTP-status code
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestParam Long id) {
        if (sessionRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        sessionRepository.deleteById(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Deletes all sessions containing the given plan id.
     * 
     * @param id plan_id
     * @return HTTP-status code for the request.
     */
    @DeleteMapping("/deleteByPlan")
    public ResponseEntity<Void> deleteByPlan(@RequestParam Long id) {
        if (!sessionRepository.findAllByPlan(id).isEmpty()) {
            sessionRepository.deleteAllByPlan(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Get all sessions belonging to a plan given a plan id.
     * 
     * @param id The session id.
     * @param startDate Optional, filters the search by only getting the sessions after this date. 
     * @return HTTP-status code and the list of sessions. 
     */
    @GetMapping("/getByPlan")
    public Object getByPlan(@RequestParam Long id, @RequestParam(required = false) Long startDate) {
        List<Session> sessionList;
        if(startDate != null){
            sessionList = sessionRepository.findAllByPlanAfterGivenDate(id, LocalDate.ofInstant(Instant.ofEpochMilli(startDate), ZoneId.of("UTC")));
        } else{
            sessionList = sessionRepository.findAllByPlan(id);
        }

        if(sessionList.isEmpty()){
            return new ResponseEntity<>(sessionList, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(sessionList, HttpStatus.OK);
    }

    /**
     * Get all sessions belonging to several plans given a list of plan sessison ids.
     * 
     * @param id The list of session ids.
     * @param startDate Optional, filters the search by only getting the sessions after this date.
     * @return HTTP- status code and the list of sessions.
     */
    @GetMapping("/getByPlans")
    public Object getByPlans(@RequestParam List<Long> id, @RequestParam(required = false) Long startDate) {
        List<Session> sessionList = new ArrayList<>();
        for (Long i : id) {
            if(startDate != null){
                sessionList.addAll(sessionRepository.findAllByPlanAfterGivenDate(
                    i, LocalDate.ofInstant(Instant.ofEpochMilli(startDate), ZoneId.of("UTC"))));
            } else{
                sessionList.addAll(sessionRepository.findAllByPlan(i));
            }
        }

        if(sessionList.isEmpty()){
            return new ResponseEntity<>(sessionList, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(sessionList, HttpStatus.OK);
    }

    /**
     * Updates session with given id using the provided text, workout id, and time.
     * 
     * @param id Id of session to update
     * @param updateInfo Map of fields and values sent through request body.
     * @return Response with status code and body containing the updated session.
     */
    @PutMapping("/update")
    public ResponseEntity<Session> update(@RequestParam Long id, @RequestBody Map<String, Object> updateInfo){
        Optional<Session> toUpdateResult = sessionRepository.findById(id);

        if(toUpdateResult.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Session toUpdate = toUpdateResult.get();

        //Check which fields were sent to be updated and update if present in request body
        if(updateInfo.containsKey("text")){
            String text = (String) updateInfo.get("text");
            toUpdate.setText(text);
        }
        if(updateInfo.containsKey("workout")){
            Long workout = null;
            if(updateInfo.get("workout") != null){
                workout = ((Number)updateInfo.get("workout")).longValue();
            }
            toUpdate.setWorkout(workout);
        }
        if(updateInfo.containsKey("plan")){
            Long plan = ((Number)updateInfo.get("plan")).longValue();
            toUpdate.setPlan(plan);
        }
        if(updateInfo.containsKey("date")){
            LocalDate date = LocalDate.parse(updateInfo.get("date").toString());
            toUpdate.setDate(date);
        }
        if(updateInfo.containsKey("time")){
            CharSequence fieldValue = (CharSequence) updateInfo.get("time");
            LocalTime time = null;
            if(fieldValue != null){
                time = LocalTime.parse(fieldValue);
            }
            toUpdate.setTime(time);
        }

        //Update and return updated session with OK code
        return new ResponseEntity<>(sessionRepository.save(toUpdate), HttpStatus.OK);
    }
}
