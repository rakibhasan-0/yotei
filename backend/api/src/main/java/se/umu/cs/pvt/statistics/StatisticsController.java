package se.umu.cs.pvt.statistics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import java.util.stream.Collectors;

/**
 * Class for handling requests to the statistics API.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-04-29
 */
@RestController
@RequestMapping(path = "/api/statistics")
public class StatisticsController {
    
    private StatisticsRepository statisticsRepository;

    @Autowired
    public StatisticsController(StatisticsRepository statisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    @Operation(summary = "Returns the techniques and exercises done for a group sorted from highest to lowest occurence.", 
               description = "Must include a group id as path variable. All other request parameters are optional they default to false. If not valid date interval is set, all session reviews are included in the statistics.")
    @GetMapping("/{id}")
    public ResponseEntity<StatisticsResponseWrapper> getTechniquesStats(@PathVariable Long id, 
                                                                       @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<LocalDate> startdate , 
                                                                       @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<LocalDate> enddate, 
                                                                       @RequestParam Optional<Boolean> kihon, 
                                                                       @RequestParam Optional<Boolean> showexercises){
        
        // Check if kihon paramter is set and show only kihon techniques if it is.
        boolean filterKihon = false;
        if (kihon.isPresent() && kihon.get()) {
            filterKihon = true;
        }
                                                       
        // Check if date filter is present
        boolean showAllDates = true;
        LocalDate sdate = null;
        LocalDate edate = null;
        if (startdate.isPresent() && enddate.isPresent()) {
            sdate = startdate.get();
            edate = enddate.get();
            showAllDates = false;  
        }

        // Check if showexercises parameter is set and show exercises if it is.
        List<StatisticsResponse> exercises;
        if (showexercises.isPresent() && showexercises.get()) {
            exercises = statisticsRepository.getSampleExercisesQuery(id, showAllDates, sdate, edate);
        } else {
            // Set to empty ArrayList if not to allow stream.
            exercises = new ArrayList<>();
        }

        // Get techniques with filters applied
        List<StatisticsResponse> techniques = statisticsRepository.getSampleTechniquesQuery(id, filterKihon, showAllDates, sdate, edate);

        // Combine the two lists and sort them.
        List<StatisticsResponse> union = Stream.concat( exercises.stream(), techniques.stream())
            .sorted(Comparator.comparingLong(StatisticsResponse::getCount).reversed())
            .collect( Collectors.toList());

        // Get the list of belts for every technique and add them to the response entity.
        for (StatisticsResponse sr : union) {
            if (sr.getType().equals("technique")) {
                sr.setBelts(statisticsRepository.getBeltsForTechnique(sr.getActivity_id()));
            }
        }
        
        int numSessions = statisticsRepository.getNumberOfSessions(id, filterKihon, showAllDates, sdate, edate);
        double averageRating = 4.5; //TODO: get average rating when session review is implemented
        StatisticsResponseWrapper response = new StatisticsResponseWrapper(numSessions, averageRating, union);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
