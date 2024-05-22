package se.umu.cs.pvt.techniqueChain;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

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
                jsonGenerator.writeFieldName("id");
                jsonGenerator.writeNumber(edge.getId());
                jsonGenerator.writeFieldName("node_x_pos");
                jsonGenerator.writeNumber(edge.getNode_x_pos());
                jsonGenerator.writeFieldName("node_y_pos");
                jsonGenerator.writeNumber(edge.getNode_y_pos());
                jsonGenerator.writeEndObject();
                
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndObject();
    }
}