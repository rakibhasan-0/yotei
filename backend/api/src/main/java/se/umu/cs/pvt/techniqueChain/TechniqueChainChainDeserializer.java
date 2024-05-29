package se.umu.cs.pvt.techniqueChain;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Deserializer to parse the incoming data of the chainChain correctly.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
@Component
public class TechniqueChainChainDeserializer extends JsonDeserializer<TechniqueChainChain> {

    private static TechniqueChainChainRepository chainRepository;

    @Autowired
    public void setChainRepository(TechniqueChainChainRepository chainRepository) {
        TechniqueChainChainDeserializer.chainRepository = chainRepository;
    }

    @Override
    public TechniqueChainChain deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        Long id = p.getLongValue();
        return chainRepository.findById(id).orElse(null);
    }
}