package se.umu.cs.pvt.techniqueChain;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.IOException;

/**
 * The deserializer for the incoming data in TechniqueChainWeave.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
@Component
public class TechniqueChainWeaveDeserializer extends JsonDeserializer<TechniqueChainWeave> {

    
    private TechniqueChainWeaveRepository techniqueChainWeaveRepository;

    @Autowired
    public void setTechniqueChainWeaveRepository(TechniqueChainWeaveRepository techniqueChainWeaveRepository) {
        this.techniqueChainWeaveRepository = techniqueChainWeaveRepository;
    }

    //to get the entire TechniqueChainWeave object insted of just the id of the TechniqueChaineWeave.
    @Override
    public TechniqueChainWeave deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        Long id = p.getLongValue();
        return techniqueChainWeaveRepository.findById(id).orElse(null);
    }
}