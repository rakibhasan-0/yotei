package se.umu.cs.pvt.statistics;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
  * @author Cocount (and MR. GPT)
  * @version 1.0
  * @since 2024-05-07
  */
@WebMvcTest(controllers = StatisticsController.class)
@ExtendWith(MockitoExtension.class)
public class StatisticsAPITest {
    

    @MockBean
    private StatisticsRepository statisticsRepository;

    @Autowired
    private MockMvc mockMvc;



    @Test
    void shouldReturn204WhenemptyResults() throws Exception {
        Long groupId = 1L;

        Mockito.when(statisticsRepository.getAllSampleTechniquesQuery(groupId)).thenReturn(new ArrayList<>());

        mockMvc.perform(
                MockMvcRequestBuilders.get("/api/statistics/{id}", groupId) 
            )
            .andExpect(MockMvcResultMatchers.status().isNoContent()); 

    }


    @Test
    void shouldReturnAllActivitiesWhenShowExercisesIsSet() throws Exception {
        List<StatisticsActivity> techniqueList = new ArrayList<>();
        techniqueList.add(new StatisticsActivity(1L, 138L, "Kamae, neutral (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        techniqueList.add(new StatisticsActivity(1L,139L, "Kamae, beredd (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        techniqueList.add(new StatisticsActivity(1L, 140L, "Kamae, gard (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));

        List<StatisticsActivity> exerciseList = new ArrayList<>();
        exerciseList.add(new StatisticsActivity(1L, 8L, "Armhävning", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        exerciseList.add(new StatisticsActivity(1L,9L, "Bicepscurl", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));


        Long groupId = 1L;
        Boolean showExercises = true; 

        Mockito.when(statisticsRepository.getAllSampleTechniquesQuery(groupId)).thenReturn(techniqueList);  
        Mockito.when(statisticsRepository.getAllSampleExercisesQuery(groupId)).thenReturn(exerciseList);  


        mockMvc.perform(
                MockMvcRequestBuilders.get("/api/statistics/{id}", groupId)
                    .param("showexercises", showExercises.toString())
            )
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$.numberOfSessions").value(1)) // Check number of sessions
            .andExpect(MockMvcResultMatchers.jsonPath("$.averageRating").value(4.0)) // Check average rating
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isArray()) // Check activities is an array
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities.length()").value(5)) // Check the length of activities

            // First activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].activity_id").value(8)) // ID of the first activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].name").value("Armhävning")) // Name of the first activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].type").value("technique")) // Type of the first activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].count").value(1)) // Count for the first activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].beltColors").isArray()) // Check if beltColors is an array
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].beltColors.length()").value(0)) // Check if beltColors is empty

            // Second activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[1].activity_id").value(9)) // ID of the second activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[1].name").value("Bicepscurl")) // Name of the second activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[1].type").value("technique")) // Type of the second activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[1].count").value(1)) // Count for the second activity

            // Third activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[2].activity_id").value(138)) // ID of the third activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[2].name").value("Kamae, neutral (5 Kyu)")) // Name of the third activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[2].type").value("technique")) // Type of the third activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[2].count").value(1)) // Count for the third activity

            // Fourth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[3].activity_id").value(139)) // ID of the fourth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[3].name").value("Kamae, beredd (5 Kyu)")) // Name of the fourth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[3].type").value("technique")) // Type of the fourth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[3].count").value(1)) // Count for the fourth activity

            // Fifth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].activity_id").value(140)) // ID of the fifth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].name").value("Kamae, gard (5 Kyu)")) // Name of the fifth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].type").value("technique")) // Type of the fifth activity
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].count").value(1)); // Count for the fifth activity
  }

    @Test
    void shouldReturn204WhenDateFilterMatchesNoActivities() throws Exception {
        List<StatisticsActivity> techniqueList = new ArrayList<>();
        techniqueList.add(new StatisticsActivity(1L, 138L, "Kamae, neutral (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        techniqueList.add(new StatisticsActivity(1L,139L, "Kamae, beredd (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        techniqueList.add(new StatisticsActivity(1L, 140L, "Kamae, gard (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));

        List<StatisticsActivity> exerciseList = new ArrayList<>();
        exerciseList.add(new StatisticsActivity(1L, 8L, "Armhävning", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        exerciseList.add(new StatisticsActivity(1L,9L, "Bicepscurl", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));


        Long groupId = 1L;
        String startDate = "2023-01-01";
        String endDate = "2023-12-31"; 
        Boolean showExercises = true; 

        Mockito.when(statisticsRepository.getAllSampleTechniquesQuery(groupId)).thenReturn(techniqueList);  
        Mockito.when(statisticsRepository.getAllSampleExercisesQuery(groupId)).thenReturn(exerciseList);  


        mockMvc.perform(
                MockMvcRequestBuilders.get("/api/statistics/{id}", groupId)
                    .param("startdate", startDate)
                    .param("enddate", endDate)
                    .param("showexercises", showExercises.toString())
            )
            .andExpect(MockMvcResultMatchers.status().isNoContent());
    }


    @Test
    void shouldReturnOnlyKihonActivityWhenKihonIsSet() throws Exception {
        List<StatisticsActivity> techniqueList = new ArrayList<>();
        techniqueList.add(new StatisticsActivity(1L, 138L, "Kamae, neutral (5 Kyu)", "technique", 1L, true, LocalDate.of(2024, 5, 7), 4));
        techniqueList.add(new StatisticsActivity(1L,139L, "Kamae, beredd (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        techniqueList.add(new StatisticsActivity(1L, 140L, "Kamae, gard (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));

        List<StatisticsActivity> exerciseList = new ArrayList<>();
        exerciseList.add(new StatisticsActivity(1L, 8L, "Armhävning", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        exerciseList.add(new StatisticsActivity(1L,9L, "Bicepscurl", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));


        Long groupId = 1L;
        String startDate = "2023-01-01";
        String endDate = "2025-12-31";
        Boolean kihon = true;
        Boolean showExercises = true; 

        Mockito.when(statisticsRepository.getAllSampleTechniquesQuery(groupId)).thenReturn(techniqueList);  
        Mockito.when(statisticsRepository.getAllSampleExercisesQuery(groupId)).thenReturn(exerciseList);  


        mockMvc.perform(
                MockMvcRequestBuilders.get("/api/statistics/{id}", groupId)
                    .param("startdate", startDate)
                    .param("enddate", endDate)
                    .param("kihon", kihon.toString())
                    .param("showexercises", showExercises.toString())
            )
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$.numberOfSessions").value(1))
            .andExpect(MockMvcResultMatchers.jsonPath("$.averageRating").value(4.0))
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isArray())
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities.length()").value(1))
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].activity_id").value(138))
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].name").value("Kamae, neutral (5 Kyu)"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].type").value("technique"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].count").value(1))
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].beltColors").isArray())
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].beltColors.length()").value(0));

   }

    @Test
    void shouldCalculateAverageWhenMoreThanOneSession() throws Exception {
        List<StatisticsActivity> techniqueList = new ArrayList<>();
        techniqueList.add(new StatisticsActivity(1L, 138L, "Kamae, neutral (5 Kyu)", "technique", 1L, true, LocalDate.of(2024, 5, 7), 4));
        techniqueList.add(new StatisticsActivity(2L,139L, "Kamae, beredd (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 1));
        techniqueList.add(new StatisticsActivity(3L, 140L, "Kamae, gard (5 Kyu)", "technique", 1L, false, LocalDate.of(2024, 5, 7), 2));

        List<StatisticsActivity> exerciseList = new ArrayList<>();
        exerciseList.add(new StatisticsActivity(1L, 8L, "Armhävning", "technique", 1L, false, LocalDate.of(2024, 5, 7), 4));
        exerciseList.add(new StatisticsActivity(2L,9L, "Bicepscurl", "technique", 1L, false, LocalDate.of(2024, 5, 7), 1));


        Long groupId = 1L;
        String startDate = "2023-01-01"; // Example start date
        String endDate = "2025-12-31"; // Example end date
        Boolean kihon = false; // Example optional parameter
        Boolean showExercises = true; 

        Mockito.when(statisticsRepository.getAllSampleTechniquesQuery(groupId)).thenReturn(techniqueList);  
        Mockito.when(statisticsRepository.getAllSampleExercisesQuery(groupId)).thenReturn(exerciseList);  


        mockMvc.perform(
                MockMvcRequestBuilders.get("/api/statistics/{id}", groupId)
                    .param("startdate", startDate)
                    .param("enddate", endDate)
                    .param("kihon", kihon.toString())
                    .param("showexercises", showExercises.toString())
            )
            .andExpect(MockMvcResultMatchers.status().isOk()) // Status 200 OK
            .andExpect(MockMvcResultMatchers.jsonPath("$.numberOfSessions").value(3)) // Check number of sessions
            .andExpect(MockMvcResultMatchers.jsonPath("$.averageRating").value(2.33)) // Check average rating
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isArray()) // Ensure activities is an array
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities.length()").value(5)) // Ensure the length is 5
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].activity_id").value(8)) // Check first activity ID
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].name").value("Armhävning")) // Check name with unicode
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].type").value("technique")) // First activity's type
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].count").value(1)) // First activity's count
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[0].beltColors").isArray()) // Check beltColors is an array
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[1].activity_id").value(9)) // Second activity ID
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[1].name").value("Bicepscurl")) // Second activity name
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[1].type").value("technique")) // Second activity's type
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[2].activity_id").value(138)) // Third activity ID
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[2].name").value("Kamae, neutral (5 Kyu)")) // Third activity name
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[2].count").value(1)) // Third activity's count
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[3].activity_id").value(139)) // Fourth activity ID
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[3].name").value("Kamae, beredd (5 Kyu)")) // Fourth activity name
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[3].type").value("technique")) // Fourth activity's type
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].activity_id").value(140)) // Fifth activity ID
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].name").value("Kamae, gard (5 Kyu)")) // Fifth activity name
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].type").value("technique")) // Fifth activity's type
            .andExpect(MockMvcResultMatchers.jsonPath("$.activities[4].count").value(1)); // Fifth activity's count

 }
}

