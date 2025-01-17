package se.umu.cs.pvt.techniqueChain;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;

/**
 * A serializer for the data that the node returns.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public class TechniqueChainNodeSerializer extends StdSerializer<TechniqueChainNode> {

    public TechniqueChainNodeSerializer() {
        this(null);
    }

    public TechniqueChainNodeSerializer(Class<TechniqueChainNode> t) {
        super(t);
    }

    @Override
    public void serialize(TechniqueChainNode node, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("id", node.getId());
        jsonGenerator.writeStringField("name", node.getName());
        jsonGenerator.writeStringField("description", node.getDescription());
        jsonGenerator.writeBooleanField("attack", node.getAttack());
        jsonGenerator.writeNumberField("participant", node.getParticipant());
        jsonGenerator.writeNumberField("parent_weave", node.getParentWeave().getId());
        if(node.getInChain() != null && node.getInChain().getId() != 0){
            jsonGenerator.writeNumberField("inChain", node.getInChain().getId());
        }

        // Serialize outgoingEdges only if it's not null
        if (node.getOutgoingEdges() != null) {
            jsonGenerator.writeArrayFieldStart("outgoingEdges");
            for (TechniqueChainEdges edge : node.getOutgoingEdges()) {
                jsonGenerator.writeNumber(edge.getToNode().getId());
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndObject();
    }
}
