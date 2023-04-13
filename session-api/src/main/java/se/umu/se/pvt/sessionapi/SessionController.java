package se.umu.se.pvt.sessionapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.*;

/**
 * Class for handling requests to the session api
 *
 * @author Hawaii
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
     * Adds a single session to the database
     * @param session Object mapped session from request body
     * @return Response containing the added session and an HTTP code:
     *      CREATED: If session was created
     *      BAD_REQUEST: If id was given or if plan id or date is missing
     */
    @PostMapping("/add")
    public ResponseEntity<Session> add(@RequestBody Session session){
        if(session.getId() != null || session.invalidFormat())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(sessionRepository.save(session), HttpStatus.OK);
    }

    /**
     * Adds a list of sessions into the database.
     * @param sessions A JSON list of sessions with all required fields excluding id
     * @return The added sessions including id:s
     */
    @PostMapping("/addList")
    public ResponseEntity<List<Session>> addList(@RequestBody List<Session> sessions){

        if(sessions.isEmpty() || sessions.stream().anyMatch(session -> session.getId() != null || session.invalidFormat()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(sessionRepository.saveAll(sessions), HttpStatus.CREATED);
    }

    /**
     * Adds a set of sessions based on a list of given week days as dates and an amount weeks for which
     * to create sessions for.
     * @return HTTP-status code BAD_REQUEST if the format of the input is incorrect else return HTTP-status
     * code CREATED on successfully adding sessions and also returns the sessionList in body.
     */
    @Deprecated
    public ResponseEntity<List<Session>> addRepeating(@RequestBody AddListInput input) {

        //Check if any required field is not given/null or if duplicate/excessive or no dates are given
        if(input.invalidFormat()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Session> sessionList = createSessions(input);
        sessionRepository.saveAll(sessionList);

        return new ResponseEntity<>(sessionList, HttpStatus.CREATED);
    }


    /**
     * Creates a session for each day of the week in the input for the specified amount of weeks.
     * Binds all sessions to the given plan id.
     * @param input AddListInput with all the needed data
     * @return A list of the sessions created
     */
    @Deprecated
    private List<Session> createSessions(AddListInput input) {
        List<Session> sessionList = new ArrayList<>();

        for(int i = 0; i < input.getWeeks(); i++){
            for(DateAndTime d : input.getDate_info()){
                LocalDate dateToUse = d.getDate().plus(7L*i, ChronoUnit.DAYS);
                //Convert time if time was given
                LocalTime sessionTime = null;
                if(d.getTime() != null) sessionTime = d.getTime();
                //Id is generated and text and workout are normally not specified on creation
                sessionList.add(new Session(null, null, null, input.getPlan_id(), dateToUse, sessionTime));
            }
        }
        return sessionList;
    }

    /**
     * Delete a session given an id.
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
     * @param id plan_id
     * @return HTTP-status code for the request
     *         - 200 if the request was successful
     *         - 404 if the plan was not found
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
     * @return HTTP-status code
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


    @GetMapping("/getByPlans")
    public Object getByPlans(@RequestParam List<Long> id, @RequestParam(required = false) Long startDate) {
        List<Session> sessionList = new ArrayList<>();
        for (Long i : id) {
            if(startDate != null){
                sessionList.addAll(sessionRepository.findAllByPlanAfterGivenDate(i, LocalDate.ofInstant(Instant.ofEpochMilli(startDate), ZoneId.of("UTC"))));
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
     * @param id Id of session to update
     * @param updateInfo Map of fields and values sent through request body.
     * @return Response with status code and body containing the updated session
     * Status codes:
     *    OK: On successful update
     *    NOT_FOUND: If no session with given id is present
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
            LocalDate date = (LocalDate) updateInfo.get("date");
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
