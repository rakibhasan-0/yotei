package se.umu.cs.pvt.techniqueChain;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * The servise class for TechniqueChainChain
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
@Service
public class TechniqueChainChainService {
    
    private TechniqueChainChainRepository chainRepository;

    @Autowired
    public TechniqueChainChainService(TechniqueChainChainRepository chainRepository) {
        this.chainRepository = chainRepository;
    }

    @Transactional(readOnly = true)
    public TechniqueChainChain getTechniqueChainWithNodes(Long id) {
        return chainRepository.findByIdWithNodes(id);
    }

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