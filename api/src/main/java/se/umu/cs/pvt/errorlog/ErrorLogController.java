package se.umu.cs.pvt.errorlog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;


import java.util.List;

/**
 * Controller for fetching and storing error logs
 *
 * @author Team 3 Dragon
 * date: 2023-04-25
 */
 @RestController
 @CrossOrigin
 @RequestMapping(path = "/api/errorlogs")
public class ErrorLogController {

    private ErrorLogRepository errorLogRepository;

    @Autowired
    public ErrorLogController(ErrorLogRepository errorLogRepository) {
        this.errorLogRepository = errorLogRepository;
    }

    /**
     * Returns all error logs in the database. Can be null if zero errors are present
     * @return A list of all the error logs
     */
    @GetMapping("/all")
    public Object getErrorLogs() {
        List<ErrorLog> errorLogList = errorLogRepository.findAll();
        if (errorLogList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return errorLogList;
    }


    /**
     * Add an error log to the database
     * Returns 400 BAD_REQUEST if trying to insert null values
     * Returns 406 NOT_ACCEPTABLE if other error
     * Returns 200 OK if error_log is posted
     *
     * @param toAdd the body in json format with correct attributes example:
     *              {"errorMessage": "GeneratedError: myerror", "infoMessage": "abcd"}
     *
     * @return The added error log and http status
     */
    @PostMapping(value="/add")
    public ResponseEntity<Object> addErrorLog(@RequestBody ErrorLog toAdd) {
        
        // Remove unneccesary parts from "infoMessage" (stack trace)
        String info = toAdd.getInfoMessage();
        info = formatStackTrace(info);
        toAdd.setInfoMessage(info);

        // Save in database
        try{
            errorLogRepository.save(toAdd);
        } catch (Exception e) {
            e.printStackTrace();
            if (toAdd.hasNullAttributes()){
                return new ResponseEntity<>("Could not save, input contains null values", HttpStatus.BAD_REQUEST);
            }            
            if (toAdd.equals(null)){
                return new ResponseEntity<>("Input is null", HttpStatus.NOT_ACCEPTABLE);
            }
            return new ResponseEntity<Object>("Could not save to database", HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(toAdd, HttpStatus.CREATED);
    }

    /**
     * This method removes all the error log entities from the database
     * @return Returns OK if the exercise exists in the database, else BAD_REQUEST.
     */
    @DeleteMapping(value="/remove", consumes="application/json")
    public ResponseEntity<ErrorLog> removeAllErrorLogs() {
        try { 
            errorLogRepository.deleteAll();
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Remove unneccesary parts from "infoMessage" (stack trace), stopping after 400 characters
     * @param info String containing generated stack trace
     * @return Shortened string
     */
    private String formatStackTrace(String info){

        String[] splitStrings = info.split("\\s+");
        int maxChars = 400; // Character limit
        String infoResult = "";
        for (int i=0; i<splitStrings.length; i++){
            infoResult = infoResult + " " + splitStrings[i];
            if (infoResult.length() > maxChars){
                if (!infoResult.endsWith("\"}")){
                    infoResult += "\"}";
                }
                break;
            }
        }

        return infoResult;
    }
}
