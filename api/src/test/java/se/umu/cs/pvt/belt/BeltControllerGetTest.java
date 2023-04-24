package se.umu.cs.pvt.belt;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

/**
 * Test class for Belt Controller endpoint.
 *
 * @author Max Thoren
 * @author Andre Byström
 * date: 2023-04-24
 */
@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class BeltControllerGetTest {
    @Mock
    private BeltRepository beltRepository;

    @Test
    public void shouldGetBelts() {
        // Arrange
        BeltController controller = new BeltController(beltRepository);
        when(beltRepository.findAll()).thenReturn(List.of(
                new Belt(1L, "Gult", "50000", true),
                new Belt(2L, "Svart", "000000", false)
        ));

        // Act
        List<Belt> belts = controller.getBelts();
        Belt belt1 = belts.get(0);
        Belt belt2 = belts.get(1);

        // Assert
        assertThat(belt1.getId()).isEqualTo(1L);
        assertThat(belt1.getName()).isEqualTo("Gult");
        assertThat(belt1.getColor()).isEqualTo("50000");
        assertThat(belt1.isChild()).isTrue();

        assertThat(belt2.getId()).isEqualTo(2L);
        assertThat(belt2.getName()).isEqualTo("Svart");
        assertThat(belt2.getColor()).isEqualTo("000000");
        assertThat(belt2.isChild()).isFalse();
    }
}
