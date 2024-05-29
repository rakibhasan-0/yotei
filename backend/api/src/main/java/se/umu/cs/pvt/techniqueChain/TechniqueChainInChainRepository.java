package se.umu.cs.pvt.techniqueChain;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The Repository class for the techniqueChainInChain class
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public interface TechniqueChainInChainRepository extends JpaRepository<TechniqueChainInChain, Long>{
    //to get all the nodes that are in a specific chain.
    List<TechniqueChainInChain> findByChainId(Long chainId);
} 