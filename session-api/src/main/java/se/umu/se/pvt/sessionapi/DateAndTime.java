package se.umu.se.pvt.sessionapi;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

/**
 * Data class for structuring input to the "/addlist" request in the session api. Models a weekday/time pair from
 * the plan creation page in the frontend
 * @author c19rll (Hawaii)
 * @implNote @Data is a lombok feature (https://projectlombok.org/features/Data) which creates getters
 * and a constructor automatically.
 */
@Data
public class DateAndTime {
    //The date
    private final LocalDate date;
    //The time in minutes from 00.00
    private final LocalTime time;
}
