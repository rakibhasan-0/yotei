package se.umu.cs.pvt.techniqueChain;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class TechniqueChainNodeService {

    @Autowired
    private TechniqueChainNodeRepository nodeRepository;

    public List<TechniqueChainNode> getAllNodes() {
        return nodeRepository.findAll();
    }

    public boolean deleteNode(Long id) {
        // Check if the node exists
        if (nodeRepository.existsById(id)) {
            nodeRepository.deleteById(id);
            return true; // Node deleted successfully
        } else {
            return false; // Node not found
        }
    }

    public TechniqueChainNode updateNode(Long id, TechniqueChainNode updatedNodeData) {
        // Retrieve the node from the database
        Optional<TechniqueChainNode> optionalNode = nodeRepository.findById(id);
        if (optionalNode.isPresent()) {
            TechniqueChainNode existingNode = optionalNode.get();
            
            // Update the fields of the existing node with the new data
            existingNode.setName(updatedNodeData.getName());
            existingNode.setDescription(updatedNodeData.getDescription());
            existingNode.setTechnique(updatedNodeData.getTechnique());
            existingNode.setAttack(updatedNodeData.getAttack());
            existingNode.setParticipant(updatedNodeData.getParticipant());
            existingNode.setParent_weave(updatedNodeData.getParent_weave());
            
            // Save the updated node
            return nodeRepository.save(existingNode);
        } else {
            return null; // Node not found
        }
    }
}
