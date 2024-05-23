package se.umu.cs.pvt.statistics;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import se.umu.cs.pvt.belt.Belt;

import static org.junit.jupiter.api.Assertions.assertEquals;


/**
  * @author Cocount 
  * @version 1.0
  * @since 2024-05-03
  */
public class BeltResponseTest {
    
        
    BeltResponse beltResponse;

    @BeforeEach
    void init() {
        Belt belt = new Belt(1L, "Gult", "123123", false, false);
        beltResponse = new BeltResponse(belt);
    }

    @Test
    void beltResponseShouldReturnName() {
        assertEquals("Gult",beltResponse.getBelt_name());
    }

    @Test
    void beltResponseShouldReturnColor() {
        assertEquals("123123",beltResponse.getBelt_color());
    }

    @Test
    void beltResponseShouldReturnIsChild() {
        assertEquals(false,beltResponse.getIs_child());
    }


}
