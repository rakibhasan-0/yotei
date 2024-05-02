package se.umu.cs.pvt.statistics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import se.umu.cs.pvt.session.Session;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import java.util.Collections;

import javax.swing.text.html.HTML;

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
    public ResponseEntity<List<StatisticsResponse>> getTechniquesStats(@PathVariable Long id) {
        List<StatisticsResponse> exercises = statisticsRepository.getSampleExercisesQuery(id);
        List<StatisticsResponse> techniques = statisticsRepository.getSampleTechniquesQuery(id);

        List<StatisticsResponse> union = Stream.concat( exercises.stream(), techniques.stream())
            .sorted(Comparator.comparingLong(StatisticsResponse::getCount).reversed())
            .collect( Collectors.toList());

        return new ResponseEntity<>(union, HttpStatus.OK);
    }



}
