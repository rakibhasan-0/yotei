package se.umu.cs.pvt.statistics;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import se.umu.cs.pvt.belt.Belt;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;


/**
  * @author Cocount 
  * @version 1.0
  * @since 2024-05-03
  */
public class StatisticsResponseTest {

    BeltResponse beltResponse;
    StatisticsResponse sr;

    @BeforeEach
    void init() {
        sr = new StatisticsResponse(1L, "Armhävningar", "exercise", 1L);
    }

    @Test
    void shouldReturnId() {
        assertEquals(1L,sr.getActivity_id());
    }

    @Test
    void shouldReturnName() {
        assertEquals("Armhävningar",sr.getName());
    }

    @Test
    void shouldReturnType() {
        assertEquals("exercise",sr.getType());
    }

    @Test
    void shouldReturnCount() {
        assertEquals(1L,sr.getCount());
    }

    @Test
    void beltsAreNotEmptyWhenBeltsAreAdded() {
        Belt b1 = new Belt(1L, "Gult", "123123", false);
        Belt b2 = new Belt(1L, "Rött", "321321", true);

        ArrayList<Belt> belts = new ArrayList<>();
        belts.add(b1);
        belts.add(b2);

        sr.setBelts(belts);

        assertEquals(false, sr.getBeltColors().isEmpty());
    }

    @Test
    void shouldRetrieveAddedBelt() {
        Belt b1 = new Belt(1L, "Gult", "123123", false);

        ArrayList<Belt> belts = new ArrayList<>();
        belts.add(b1);

        sr.setBelts(belts);


        assertEquals("Gult", sr.getBeltColors().get(0).getBelt_name());
        assertEquals("123123", sr.getBeltColors().get(0).getBelt_color());
        assertEquals(false, sr.getBeltColors().get(0).getIs_child());

    }
}
