package se.umu.cs.pvt.statistics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.sql.Date;
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

    @GetMapping("/{id}")
    public ResponseEntity<List<StatisticsResponse>> getTechniquesStats(@PathVariable Long id, @RequestParam Optional<Date> startdate, @RequestParam Optional<Date> enddate) {


        if (startdate.isPresent() && enddate.isPresent()) {
            System.out.println("filter between dates: " + startdate.get() + " - " + enddate.get());
        }

        List<StatisticsResponse> exercises = statisticsRepository.getSampleExercisesQuery(id);
        List<StatisticsResponse> techniques = statisticsRepository.getSampleTechniquesQuery(id);

        List<StatisticsResponse> union = Stream.concat( exercises.stream(), techniques.stream())
            .sorted(Comparator.comparingLong(StatisticsResponse::getCount).reversed())
            .collect( Collectors.toList());

        return new ResponseEntity<>(union, HttpStatus.OK);
    }



}
