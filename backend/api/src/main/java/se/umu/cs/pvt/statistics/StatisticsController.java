package se.umu.cs.pvt.statistics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;
import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.statistics.gradingprotocol.GradingProtocolCategory;
import se.umu.cs.pvt.statistics.gradingprotocol.GradingProtocolDTO;
import se.umu.cs.pvt.statistics.gradingprotocol.GradingProtocolTechinque;

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
               description = "Must include a group id as path variable. All other request parameters are optional and default to false. If no valid date interval is set, all session reviews are included in the statistics. Get activity statistics by group id. NumberOfSessions is the number of session reviews that matach the current filter and AverageRating is the average rating of those reviews. All techniques associated with the group that are not performed in any session are included with count = 0.")
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
        
        // Get all techniques associated with the groups belts
        List<Belt> groupBelts = statisticsRepository.getBeltsForGroup(id);
        List<StatisticsResponse> allTechniques = statisticsRepository.getTechniquesForBelts(groupBelts);   
        
        // Add the techniques that has not been performed by the group
        for (StatisticsResponse sr : allTechniques) {
            if (!uniqueActivityIds.contains(sr.getActivity_id())) {
                // I can't get the repository method to include the belts so we have to get them once again... :(
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

    @GetMapping("{id}/grading_protocol")
    public ResponseEntity<GradingProtocolDTO> getGradingProtocolView(@PathVariable Long id, @RequestParam Long beltId){

        List<StatisticsActivity> techniques = statisticsRepository.getAllSessionReviewTechniques(id);


        // Store unique activities
        List<StatisticsResponse> uniqueActivities = new ArrayList<>();;


        // Iterate through the StatisticsActivities to retrieve the relevant information.
        for (StatisticsActivity sa : techniques) {
            StatisticsResponse sr = new StatisticsResponse(sa.getActivity_id(), sa.getName(), sa.getType(), sa.getCount());
            
            if (!uniqueActivities.contains(sr)) {
                uniqueActivities.add(sr);
            } else {
                uniqueActivities.get(uniqueActivities.indexOf(sr)).addToCount(sa.getCount());
            }
        }

        GradingProtocolDTO gradingProtocol = getMockGradingProtocol();

        return new ResponseEntity<>(gradingProtocol, HttpStatus.OK);
    }


    private GradingProtocolDTO getMockGradingProtocol() {
        ArrayList<GradingProtocolCategory> categories = new ArrayList<>();

        ArrayList<GradingProtocolTechinque> atemiWazaTechinques = new ArrayList<>();
        atemiWazaTechinques.add(new GradingProtocolTechinque("Shotei uchi, jodan, rak stöt med främre och bakre handen", 151L));
        atemiWazaTechinques.add(new GradingProtocolTechinque("Shotei uchi, chudan, rak stöt med främre och bakre handen", 151L));
        atemiWazaTechinques.add(new GradingProtocolTechinque("Gedan geri, rak spark med främre och bakre benet", 153L));
        GradingProtocolCategory atemiWaza = new GradingProtocolCategory("KIHON WAZA - ATEMI WAZA", atemiWazaTechinques);


        ArrayList<GradingProtocolTechinque> kansutsuWazaTechniques = new ArrayList<>();
        kansutsuWazaTechniques.add(new GradingProtocolTechinque("O soto osae, utan grepp, nedläggning snett bakåt", 187L));
        GradingProtocolCategory kansutsuWaza = new GradingProtocolCategory("KIHON WAZA - KANSUTSU WAZA", kansutsuWazaTechniques);

        ArrayList<GradingProtocolTechinque> nageWazaTechniques = new ArrayList<>();
        nageWazaTechniques.add(new GradingProtocolTechinque("Koshi otoshi, utan grepp, nedläggning snett bakåt", 248L));
        GradingProtocolCategory nageWaza = new GradingProtocolCategory("KIHON WAZA - NAGE WAZA", nageWazaTechniques);

        ArrayList<GradingProtocolTechinque> jigoWazaTechniques = new ArrayList<>();
        jigoWazaTechniques.add(new GradingProtocolTechinque("Grepp i två handleder framifrån - Frigöring", 158L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Grepp i två handleder bakifrån - Frigöring", 159L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Grepp i håret bakifrån - Tettsui uchi, frigöring", 161L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Försök till stryptag framifrån - Jodan soto uke", 216L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Stryptag framifrån - Kawashi, frigöring", 162L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Stryptag bakifrån - Maesabaki, kawashi, frigöring", 163L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Stryptag med armen - Maesabaki, kuzure ude osae, ude henkan gatame", 164L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Försök till kravattgrepp från sidan - Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame", 165L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Grepp i ärmen med drag - O soto osae, ude henkan gatame", 154L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Livtag under armarna framifrån - Tate hishigi, ude henkan gatame", 169L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Stryptag mot liggande sittande vid sidan - Frigöring, ude henkan gatame", 171L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Hotfullt närmande mot liggande - Uppgång bakåt", 173L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Hotfullt närmande - Hejda med tryck", 173L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Kort svingslag - Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame", 147L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Långt svingslag - Morote jodan uke, o soto osae, ude henkan gatame", 174L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Påkslag mot huvudet - Ju morote jodan uke", 175L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Påkslag mot huvudet, backhand - Ju morote jodan uke", 176L));
        jigoWazaTechniques.add(new GradingProtocolTechinque("Knivhot mot magen - Grepp, shotei uchi jodan", 231L));
        GradingProtocolCategory jigoWaza = new GradingProtocolCategory("JIGO WAZA", jigoWazaTechniques);

        ArrayList<GradingProtocolTechinque> renrakuWazaTechniques = new ArrayList<>();
        renrakuWazaTechniques.add(new GradingProtocolTechinque("Försök till stryptag framifrån - Försök till kravattgrepp från sidan Jodan soto uke - Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame", 165L));
        GradingProtocolCategory renrakuWaza = new GradingProtocolCategory("RENRAKU WAZA", renrakuWazaTechniques);

        ArrayList<GradingProtocolTechinque> randoriTechniques = new ArrayList<>();
        randoriTechniques.add(new GradingProtocolTechinque("Försvar mot en motståndare", 157L));
        GradingProtocolCategory randori = new GradingProtocolCategory("YAKUSOKU GEIKO", randoriTechniques);


        categories.add(atemiWaza);
        categories.add(nageWaza);
        categories.add(jigoWaza);
        categories.add(renrakuWaza);
        categories.add(randori);


        return new GradingProtocolDTO("5 KYU", "GULT BÄLTE", new BeltResponse(new Belt(1L, "Gult", "FFDD33", false)), categories);
    }
}
