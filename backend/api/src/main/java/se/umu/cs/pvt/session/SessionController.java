package se.umu.cs.pvt.session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import se.umu.cs.pvt.PermissionValidator;
import se.umu.cs.pvt.plan.Plan;
import se.umu.cs.pvt.plan.PlanRepository;
import se.umu.cs.pvt.user.JWTUtil;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private final JWTUtil jwtUtil;
    private final SessionRepository sessionRepository;
    private final PlanRepository planRepository;

    @Autowired
    public SessionController(JWTUtil jwtUtil, SessionRepository sessionRepository, PlanRepository planRepository) {
        this.jwtUtil = jwtUtil;
        this.sessionRepository = sessionRepository;
        this.planRepository = planRepository;
    }

    /**
     * Get session by id
     * 
     * @param id The session id.
     * @return HTTP-status code and the list of sessions.
     */
    @GetMapping("/get")
    public ResponseEntity<Optional<Session>> get(@RequestParam Long id) {
        if (sessionRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(sessionRepository.findById(id), HttpStatus.OK);

    }

    /**
     * Gets all sessions.
     * 
     * 
     */
    @GetMapping("/all")
    public ResponseEntity<List<Session>> getAll() {
        List<Session> sessions = sessionRepository.findAll(Sort.by("date").and(Sort.by("time")));
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }

    /**
     * Adds a single session to the database.
     * 
     * @param session Object mapped session from request body.
     * @return Response containing the added session and an HTTP code.
     */
    @PostMapping("/add")
    public ResponseEntity<Session> add(@RequestBody Session session, @RequestHeader(name = "token") String token) {
        if (!canEditCreateSession(token, session)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (session.getId() != null || session.invalidFormat())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(sessionRepository.save(session), HttpStatus.OK);
    }

    /**
     * Adds a list of sessions into the database.
     * 
     * @param sessions A JSON list of sessions with all required fields excluding
     *                 id.
     * @return The added sessions including id:s.
     */
    @PostMapping("/addList")
    public ResponseEntity<List<Session>> addList(@RequestBody List<Session> sessions, @RequestHeader(name = "token") String token) {
        for (Session session : sessions) {
            if (!canEditCreateSession(token, session)) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        }

        if (sessions.isEmpty() || sessions.stream().anyMatch(session -> session.invalidFormat()))
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
    public ResponseEntity<String> delete(@RequestParam Long id, @RequestHeader(name = "token") String token) {
        Optional<Session> session = sessionRepository.findById(id);
        
        if (session.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!canEditCreateSession(token, session.get())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
    public ResponseEntity<Void> deleteByPlan(@RequestParam Long id, @RequestHeader(name = "token") String token) {
        if (!isGroupOwner(token, id)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        if (!sessionRepository.findAllByPlan(id).isEmpty()) {
            sessionRepository.deleteAllByPlan(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Get all sessions belonging to a plan given a plan id.
     * 
     * @param id        The session id.
     * @param startDate Optional, filters the search by only getting the sessions
     *                  after this date.
     * @return HTTP-status code and the list of sessions.
     */
    @GetMapping("/getByPlan")
    public Object getByPlan(@RequestParam Long id, @RequestParam(required = false) Long startDate) {
        List<Session> sessionList;
        if (startDate != null) {
            sessionList = sessionRepository.findAllByPlanAfterGivenDate(id,
                    LocalDate.ofInstant(Instant.ofEpochMilli(startDate), ZoneId.of("UTC")));
        } else {
            sessionList = sessionRepository.findAllByPlan(id);
        }

        if (sessionList.isEmpty()) {
            return new ResponseEntity<>(sessionList, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(sessionList, HttpStatus.OK);
    }

    /**
     * Get all sessions belonging to several plans given a list of plan sessison
     * ids.
     * 
     * @param id        The list of session ids.
     * @param startDate Optional, filters the search by only getting the sessions
     *                  after this date.
     * @return HTTP- status code and the list of sessions.
     */
    @GetMapping("/getByPlans")
    public Object getByPlans(@RequestParam List<Long> id, @RequestParam(required = false) Long startDate) {
        List<Session> sessionList = new ArrayList<>();
        for (Long i : id) {
            if (startDate != null) {
                sessionList.addAll(sessionRepository.findAllByPlanAfterGivenDate(
                        i, LocalDate.ofInstant(Instant.ofEpochMilli(startDate), ZoneId.of("UTC"))));
            } else {
                sessionList.addAll(sessionRepository.findAllByPlan(i));
            }
        }
        if (sessionList.isEmpty()) {
            return new ResponseEntity<>(sessionList, HttpStatus.NOT_FOUND);
        }

        // Sort the session list by date and time
        sessionList.sort(Comparator.comparing(Session::getDate).thenComparing(Session::getTime));
        
        return new ResponseEntity<>(sessionList, HttpStatus.OK);
    }

    /**
     * Updates session with given id using the provided text, workout id, and time.
     * 
     * @param id         Id of session to update
     * @param updateInfo Map of fields and values sent through request body.
     * @return Response with status code and body containing the updated session.
     */
    @PutMapping("/update")
    public ResponseEntity<Session> update(@RequestParam Long id, @RequestBody Map<String, Object> updateInfo, @RequestHeader(name = "token") String token) {
        Optional<Session> toUpdateResult = sessionRepository.findById(id);

        if (toUpdateResult.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!canEditCreateSession(token, toUpdateResult.get())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Session toUpdate = toUpdateResult.get();

        // Check which fields were sent to be updated and update if present in request
        // body
        if (updateInfo.containsKey("text")) {
            String text = (String) updateInfo.get("text");
            toUpdate.setText(text);
        }
        if (updateInfo.containsKey("workout")) {
            Long workout = null;
            if (updateInfo.get("workout") != null) {
                workout = ((Number) updateInfo.get("workout")).longValue();
            }
            toUpdate.setWorkout(workout);
        }
        if (updateInfo.containsKey("plan")) {
            Long plan = ((Number) updateInfo.get("plan")).longValue();
            toUpdate.setPlan(plan);
        }
        if (updateInfo.containsKey("date")) {
            LocalDate date = LocalDate.parse(updateInfo.get("date").toString());
            toUpdate.setDate(date);
        }
        if (updateInfo.containsKey("time")) {
            CharSequence fieldValue = (CharSequence) updateInfo.get("time");
            LocalTime time = null;
            if (fieldValue != null) {
                time = LocalTime.parse(fieldValue);
            }
            toUpdate.setTime(time);
        }

        // Update and return updated session with OK code
        return new ResponseEntity<>(sessionRepository.save(toUpdate), HttpStatus.OK);
    }

    private boolean canEditCreateSession(String token, Session session) {
        DecodedJWT jwt;

        try {
            jwt = jwtUtil.validateToken(token);
        } catch (JWTVerificationException e) {
            throw new JWTVerificationException("Invalid token");
        }

        List<Integer> permissions = jwt.getClaim("permissions").asList(Integer.class);
        Long userId = jwt.getClaim("userId").asLong();

        if (permissions.contains(PermissionValidator.permissionList.SESSION_GROUP_ALL.value)) {
            return true;
        }

        Plan plan = planRepository.getById(session.getPlan());
        Long plan_owner = plan.getUserId();

        if (userId == plan_owner) {
            return true;
        }


        return false;
    }
    
    private boolean isGroupOwner(String token, Long plan_id) {
        DecodedJWT jwt;

        try {
            jwt = jwtUtil.validateToken(token);
        } catch (JWTVerificationException e) {
            throw new JWTVerificationException("Invalid token");
        }

        List<Integer> permissions = jwt.getClaim("permissions").asList(Integer.class);
        Long userId = jwt.getClaim("userId").asLong();

        if (permissions.contains(PermissionValidator.permissionList.SESSION_GROUP_ALL.value)) {
            return true;
        }

        Plan plan = planRepository.getById(plan_id);
        Long plan_owner = plan.getUserId();

        if (userId == plan_owner) {
            return true;
        }

        return false;
    }
}
