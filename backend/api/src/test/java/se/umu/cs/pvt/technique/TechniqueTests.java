package se.umu.cs.pvt.technique;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.tag.Tag;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;


public class TechniqueTests {

    @Test
    void shouldNotBeNullWhenCreatedWithEmptyConstructor() {
        Technique technique = new Technique();
        assertThat(technique).isNotNull();
    }
    @Test
    void shouldNotBeNullWhenCreaed() {
        Technique technique = new Technique(1L, "name", "description", new HashSet<>(), new HashSet<>());
        assertThat(technique).isNotNull();
    }


    @Test
    void validTechniqueShouldBeValid() {
        Technique valid1 = new Technique(1L, "a technique name", "a fitting description", null, null);

        assertThat(valid1.validFormat()).isTrue();
    }

    @Test
    void techniqueWithNoNameShouldNotBeValid() {
        Technique unvalid = new Technique(1L, "", "one description", null, null);
        assertThat(unvalid.validFormat()).isFalse();
    }

    @Test
    void techniqueWithTooLongNameShouldNotBeValid() {
        String name = "some long name".repeat(100);
        Technique unvalid = new Technique(1L, name, "some description", null, null);
        assertThat(unvalid.validFormat()).isFalse();
    }

    @Test
    void techniqueWithLongDescriptionShouldBeValid() {
        String description = "some long description".repeat(1000);
        Technique valid = new Technique(1L, "some name", description, null, null);
        assertThat(valid.validFormat()).isTrue();
    }


    @Test
    void correctlyRemoveWhiteSpace() {
        String name = "     some name with whitespace       ";
        String description = "   some      other     description      ";

        Technique technique = new Technique(1L, name, description, null, null);

        assertThat(technique.getName()).isEqualTo(name.trim());
        assertThat(technique.getDescription()).isEqualTo(description.trim());
    }

}
