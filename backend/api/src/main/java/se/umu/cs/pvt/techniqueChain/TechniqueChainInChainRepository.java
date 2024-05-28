package se.umu.cs.pvt.techniqueChain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechniqueChainInChainRepository extends JpaRepository<TechniqueChainInChain, Long>{
    List<TechniqueChainInChain> findByChainId(Long chainId);
} 