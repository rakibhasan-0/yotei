package se.umu.cs.pvt.techniqueChain;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class TechniqueChainWeaveRepresentSerializer extends StdSerializer<TechniqueWeaveRepresent>{
    
    public TechniqueChainWeaveRepresentSerializer() {
        this(null);
    }

    public TechniqueChainWeaveRepresentSerializer(Class<TechniqueWeaveRepresent> t) {
        super(t);
    }

    @Override
    public void serialize(TechniqueWeaveRepresent node, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("id", node.getId());
        jsonGenerator.writeNumberField("node_id", node.getNode_id());
        jsonGenerator.writeNumberField("node_x_pos", node.getNode_x_pos());
        jsonGenerator.writeNumberField("node_y_pos", node.getNode_y_pos());
        if(node.getTechniqueWeave() != null) {
            jsonGenerator.writeObjectField("techniqueWeave", node.getTechniqueWeave());
        }
        jsonGenerator.writeEndObject();
    }
}
