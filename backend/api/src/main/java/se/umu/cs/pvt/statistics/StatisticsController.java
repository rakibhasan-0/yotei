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
               description = "Must include a group id as path variable. All other request parameters are optional they default to false. If not valid date interval is set, all session reviews are included in the statistics.")
    @GetMapping("/{id}")
    public ResponseEntity<StatisticsResponseWrapper> getTechniquesStats(@PathVariable Long id, 
                                                                       @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<LocalDate> startdate , 
                                                                       @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Optional<LocalDate> enddate, 
                                                                       @RequestParam Optional<Boolean> kihon, 
                                                                       @RequestParam Optional<Boolean> showexercises){
    
        List<StatisticsActivity> techniques = statisticsRepository.getAllSampleTechniquesQuery(id);
        List<StatisticsActivity> exercises;
        
        // Check if showexercises parameter is set and show exercises if it is.
        if (showexercises.isPresent() && showexercises.get()) {
            exercises = statisticsRepository.getAllSampleExercisesQuery(id);
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

        // Store unique activities
        List<StatisticsResponse> uniqueActivities = new ArrayList<>();

        // Get belts for techniques and count distinct sessions
        // TODO: calculate average rating
        double averageRating = 4.5;
        Set<Long> uniqueSessionIds = new HashSet<>();
        for (StatisticsActivity sa : union) {
            StatisticsResponse sr = new StatisticsResponse(sa.getActivity_id(), sa.getName(), sa.getType(), sa.getCount());
            
            uniqueSessionIds.add(sa.getSession_id());
            if (sr.getType().equals("technique")) {
                sr.setBelts(statisticsRepository.getBeltsForTechnique(sr.getActivity_id()));
            }
            if (!uniqueActivities.contains(sr)) {
                uniqueActivities.add(sr);
            }
        }

        // Sort remaining response entities
        uniqueActivities = uniqueActivities.stream()
            .sorted(Comparator.comparingLong(StatisticsResponse::getCount).reversed())
            .collect( Collectors.toList());
 
        
        
        StatisticsResponseWrapper response = new StatisticsResponseWrapper(uniqueSessionIds.size(), averageRating, uniqueActivities);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
