package se.umu.cs.pvt.techniqueChain;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path = "/api/techniquechain")
public class TechniqueChainController {

    private TechniqueChainNodeRepository nodeRepository; 

    @Autowired
    public TechniqueChainController(TechniqueChainNodeRepository nodeRepository) {
        this.nodeRepository = nodeRepository;
    }

    protected TechniqueChainController() {}

    @PostMapping("/node/create")
    public ResponseEntity<Object> createNewNode(@RequestBody TechniqueChainNode node) {
        TechniqueChainNode newNode = nodeRepository.save(node);
        return new ResponseEntity<>(newNode, HttpStatus.OK);
    }
    
    @GetMapping("/node/all")
    public ResponseEntity<List<TechniqueChainNode>> getNodes() {
        return new ResponseEntity<>(nodeRepository.findAll(), HttpStatus.OK);
    }

}
