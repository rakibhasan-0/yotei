package se.umu.cs.pvt.techniqueChain;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TechniqueWeaveService {

    @Autowired
    private TechniqueChainWeaveRepository weaveRepository;



    public List<TechniqueChainWeave> getAllTechniqueWeaves() {
        return weaveRepository.findAll();
    }

    public TechniqueChainWeave updateWeave(Long id, TechniqueChainWeave updatedNodeData) {
        // Retrieve the node from the database
        Optional<TechniqueChainWeave> optionalWeave = weaveRepository.findById(id);
        if (optionalWeave.isPresent()) {
            TechniqueChainWeave existingNode = optionalWeave.get();
            
            // Update the fields of the existing node with the new data
            existingNode.setName(updatedNodeData.getName());
            existingNode.setDescription(updatedNodeData.getDescription());
            
            // Save the updated node
            return weaveRepository.save(existingNode);
        } else {
            return null; // Node not found
        }
    }
}
