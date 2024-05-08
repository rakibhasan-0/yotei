package se.umu.cs.pvt.statistics;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;

/**
  * @author Cocount 
  * @version 1.0
  * @since 2024-05-07
  */
public class StatisticsActivityTest {
    
    BeltResponse beltResponse;
    StatisticsActivity sa;

    @BeforeEach
    void init() {
        sa = new StatisticsActivity(1L, 2L, "Armhävningar", "exercise", 3L, false, LocalDate.of(2024, 5, 7), 4);
    }

    @Test
    void shouldReturnSId() {
        assertEquals(1L,sa.getSession_id());
    }

    @Test
    void shouldReturnId() {
        assertEquals(2L,sa.getActivity_id());
    }

    @Test
    void shouldReturnName() {
        assertEquals("Armhävningar",sa.getName());
    }

    @Test
    void shouldReturnType() {
        assertEquals("exercise",sa.getType());
    }

    @Test
    void shouldReturnCount() {
        assertEquals(3L,sa.getCount());
    }

    @Test
    void shouldReturnKihon() {
        assertEquals(false,sa.getKihon());
    }

    @Test
    void shouldReturnDate() {
        assertEquals(LocalDate.of(2024, 5, 7),sa.getDate());
    }

    @Test
    void shouldReturnRating() {
        assertEquals(4,sa.getRating());
    }

}
