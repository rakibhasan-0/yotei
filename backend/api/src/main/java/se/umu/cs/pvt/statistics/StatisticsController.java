package se.umu.cs.pvt.statistics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;
import se.umu.cs.pvt.belt.Belt;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
               description = "Must include a group id as path variable. All other request parameters are optional and default to false. If no valid date interval is set, all session reviews are included in the statistics.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "OK - Successfully retrieved"),
        @ApiResponse(responseCode = "204", description = "No content - No activities found for the group.")
    })
    @GetMapping("{id}")
    public ResponseEntity<StatisticsResponseWrapper> getSessionReviewStatistics(@PathVariable Long id, 
                                                                        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<LocalDate> startdate , 
                                                                        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<LocalDate> enddate, 
                                                                        @RequestParam Optional<Boolean> kihon, 
                                                                        @RequestParam Optional<Boolean> showexercises){
    
        List<StatisticsActivity> techniques = statisticsRepository.getAllSessionReviewTechniques(id);
        List<StatisticsActivity> exercises;
        
        // Check if showexercises parameter is set and show exercises if it is.
        if (showexercises.isPresent() && showexercises.get()) {
            exercises = statisticsRepository.getAllSessionReviewExercises(id);
        } else {
            // Set to empty ArrayList if not to allow stream.
            exercises = new ArrayList<>();
        }

        

        // Combine techniques and exericises
        List<StatisticsActivity> union = Stream.concat( exercises.stream(), techniques.stream())
            .collect( Collectors.toList());
            
        // Check if kihon parameter is set and show only kihon techniques if it is.
        if (kihon.isPresent() && kihon.get()) {
            union.removeIf(item -> item.getKihon() != kihon.get());
        }
        
        // Check if date filter is present
        if (startdate.isPresent() && enddate.isPresent()) {
            union.removeIf(item -> item.getDate().isBefore(startdate.get()));
            union.removeIf(item -> item.getDate().isAfter(enddate.get()));
        }

        // Guard against empty result
        if (union.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } 

        // Store unique activities
        List<StatisticsResponse> uniqueActivities = new ArrayList<>();

        // Initialize variable for storing average rating
        double averageRating = 0;

        // Hashset to store unique session IDs to prevent double counting.
        Set<Long> uniqueSessionIds = new HashSet<>();
        // Store unique IDs to find not performed techniques.
        Set<Long> uniqueActivityIds = new HashSet<>();

        // Hashmap to store ratings for each session to prevent double counting.
        HashMap<Long,Integer> ratings = new HashMap<>();

        // Iterate through the StatisticsActivities to retrieve the relevant information.
        for (StatisticsActivity sa : union) {
            StatisticsResponse sr = new StatisticsResponse(sa.getActivity_id(), sa.getName(), sa.getType(), sa.getCount());
            
            uniqueSessionIds.add(sa.getSession_id());
            ratings.put(sa.getSession_id(), sa.getRating());
            if (sr.getType().equals("technique")) {
                uniqueActivityIds.add(sa.getActivity_id());
                sr.setBelts(statisticsRepository.getBeltsForTechnique(sr.getActivity_id()));
            }
            if (!uniqueActivities.contains(sr)) {
                uniqueActivities.add(sr);
            } else {
                uniqueActivities.get(uniqueActivities.indexOf(sr)).addToCount(sa.getCount());
            }
        }


        // Calculate average rating
        for (Long sid : uniqueSessionIds) {
            averageRating += ratings.get(sid);
        }
        averageRating /= uniqueSessionIds.size();
        averageRating = Math.round(averageRating * 100.0) / 100.0;
        

        List<Belt> groupBelts = statisticsRepository.getBeltsForGroup(id);
        List<StatisticsResponse> allTechniques = statisticsRepository.getTechniquesForBelts(groupBelts);   
        
        for (StatisticsResponse sr : allTechniques) {
            if (!uniqueActivityIds.contains(sr.getActivity_id())) {
                sr.setBelts(statisticsRepository.getBeltsForTechnique(sr.getActivity_id()));
                uniqueActivities.add(sr);
            }
        }
        
        // Sort remaining response entities
        uniqueActivities = uniqueActivities.stream()
            //.sorted(Comparator.comparing(StatisticsResponse::getName)) // Uncomment this line with preferred sort order to sort activities with the same count.
            .sorted(Comparator.comparingLong(StatisticsResponse::getCount))
            .collect( Collectors.toList());

        
        StatisticsResponseWrapper response = new StatisticsResponseWrapper(uniqueSessionIds.size(), averageRating, uniqueActivities);  
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
