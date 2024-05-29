package se.umu.cs.pvt.techniqueChain;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;

/**
 * The serializer for the TechniqueChainWeave.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public class TechniqueChainWeaveSerializer extends StdSerializer<TechniqueChainWeave> {

    public TechniqueChainWeaveSerializer() {
        this(null);
    }

    public TechniqueChainWeaveSerializer(Class<TechniqueChainWeave> t) {
        super(t);
    }

    @Override
    public void serialize(TechniqueChainWeave weave, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("id", weave.getId());
        jsonGenerator.writeStringField("name", weave.getName());
        jsonGenerator.writeStringField("description", weave.getDescription());

        // Serialize outgoingEdges only if it's not null
        if (weave.getWeaveRepresentations() != null) {
            jsonGenerator.writeArrayFieldStart("NodeInfo");
            for (TechniqueWeaveRepresent edge : weave.getWeaveRepresentations()) {
                jsonGenerator.writeStartObject();

                jsonGenerator.writeNumberField("id", edge.getId());
                jsonGenerator.writeNumberField("node_id", edge.getNode_id());
                jsonGenerator.writeNumberField("node_x_pos", edge.getNode_x_pos());
                jsonGenerator.writeNumberField("node_y_pos", edge.getNode_y_pos());
                jsonGenerator.writeEndObject();
                
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndObject();
    }
}