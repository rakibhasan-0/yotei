package se.umu.cs.pvt.techniqueChain;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class TechniqueChainChainService {
    
    @Autowired
    private TechniqueChainChainRepository chainRepository;



    public List<TechniqueChainChain> getAllTechniqueWeaves() {
        return chainRepository.findAll();
    }

    public TechniqueChainChain updateChain(Long id, TechniqueChainChain updatedChainData) {
        // Retrieve the node from the database
        Optional<TechniqueChainChain> optionalChain = chainRepository.findById(id);
        if (optionalChain.isPresent()) {
            TechniqueChainChain existingChain = optionalChain.get();
            
            // Update the fields of the existing node with the new data
            existingChain.setName(updatedChainData.getName());
            existingChain.setDescription(updatedChainData.getDescription());
            
            // Save the updated node
            return chainRepository.save(existingChain);
        } else {
            return null; // Node not found
        }
    }
    
}