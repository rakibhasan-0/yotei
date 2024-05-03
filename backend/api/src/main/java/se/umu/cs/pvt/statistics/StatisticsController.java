package se.umu.cs.pvt.statistics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import se.umu.cs.pvt.technique.Technique;

import java.io.Console;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import se.umu.cs.pvt.tag.TechniqueTag;

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
    public ResponseEntity<List<StatisticsResponse>> getTechniquesStats(@PathVariable Long id, 
                                                                       @RequestParam Optional<Date> startdate, 
                                                                       @RequestParam Optional<Date> enddate, 
                                                                       @RequestParam Optional<Boolean> kihon, 
                                                                       @RequestParam Optional<Boolean> showexercises){
        

        if (startdate.isPresent() && enddate.isPresent()) {
            System.out.println("filter between dates: " + startdate.get() + " - " + enddate.get());
        }

        List<StatisticsResponse> exercises;
        if (showexercises.isPresent() && showexercises.get()) {
            exercises = statisticsRepository.getSampleExercisesQuery(id);
        } else {
            exercises = new ArrayList<>();
        }

        List<StatisticsResponse> techniques;
        if (kihon.isPresent() && kihon.get()) {
            techniques = statisticsRepository.getSampleTechniquesQuery(id, true);
        } else {
            techniques = statisticsRepository.getSampleTechniquesQuery(id, false);
        }

        List<StatisticsResponse> union = Stream.concat( exercises.stream(), techniques.stream())
            .sorted(Comparator.comparingLong(StatisticsResponse::getCount).reversed())
            .collect( Collectors.toList());

        for (StatisticsResponse sr : union) {
            if (sr.getType().equals("technique")) {
                sr.setBelts(statisticsRepository.getBeltsForTechnique(sr.getActivity_id()));
            }
        }

        return new ResponseEntity<>(union, HttpStatus.OK);
    }



}
