package se.umu.cs.pvt.techniqueChain;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path = "/api/techniquechain")
public class TechniqueChainController {

    private TechniqueChainNodeRepository nodeRepository; 
    private TechniqueChainNodeService nodeService;

    private TechniqueChainEdgesRepository edgeRepository;

    private TechniqueChainWeaveRepository weaveRepository;
    private TechniqueWeaveService weaveService;

    @Autowired
    public TechniqueChainController(TechniqueChainNodeRepository nodeRepository, TechniqueChainNodeService nodeService, TechniqueChainEdgesRepository edgeRepository, TechniqueChainWeaveRepository weaveRepository,
            TechniqueWeaveService weaveService) {

        this.nodeRepository = nodeRepository;
        this.nodeService = nodeService;
        this.edgeRepository = edgeRepository;
        this.weaveRepository = weaveRepository;
        this.weaveService = weaveService;
    }

    protected TechniqueChainController() {}

    @PostMapping("/node/create")
    public ResponseEntity<Object> createNewNode(@RequestBody TechniqueChainNode node) {
        TechniqueChainNode newNode = nodeRepository.save(node);
        return new ResponseEntity<>(newNode, HttpStatus.OK);
    }

    @PutMapping("/node/edit")
    public ResponseEntity<TechniqueChainNode> updateNode(@RequestBody TechniqueChainNode updatedNodeData) {
        TechniqueChainNode updatedNode = nodeService.updateNode(updatedNodeData.getId(), updatedNodeData);
        if (updatedNode != null) {
            return new ResponseEntity<>(updatedNode, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/node/delete")
    public ResponseEntity<Void> deleteNode(@RequestBody DeleteNodeRequest node) {
        boolean deleted = nodeService.deleteNode(node.getDeleteNode());
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    //TODOO:ändra så att den hämtar bara alla till samma väv
    @GetMapping("/node/weave")
    public ResponseEntity<List<TechniqueChainNode>> getNodes() {
        List<TechniqueChainNode> nodes = nodeService.getAllNodes();
        for (TechniqueChainNode node : nodes) {
            // Eagerly fetch the edges if needed
            node.getOutgoingEdges().size();
        }
        return new ResponseEntity<>(nodes, HttpStatus.OK);
    }

    @GetMapping("/node/{id}")
    public ResponseEntity<TechniqueChainNode> getNodeById(@PathVariable Long id) {
        Optional<TechniqueChainNode> optionalNode = nodeRepository.findById(id);
        if (optionalNode.isPresent()) {
            TechniqueChainNode node = optionalNode.get();
            // Eagerly fetch the edges if needed
            node.getOutgoingEdges().size();
            return new ResponseEntity<>(node, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/edge/create")
    public ResponseEntity<TechniqueChainEdges> createEdge(@RequestBody TechniqueChainEdgeDTO edgeDTO) {
        try {
            // Fetch the nodes from the database
            TechniqueChainNode fromNode = nodeRepository.findById(edgeDTO.getFromNodeId())
                    .orElseThrow(() -> new IllegalArgumentException("FromNode with ID " + edgeDTO.getFromNodeId() + " does not exist"));
            TechniqueChainNode toNode = nodeRepository.findById(edgeDTO.getToNodeId())
                    .orElseThrow(() -> new IllegalArgumentException("ToNode with ID " + edgeDTO.getToNodeId() + " does not exist"));

            // Create a new edge
            TechniqueChainEdges edge = new TechniqueChainEdges();
            edge.setFromNode(fromNode);
            edge.setToNode(toNode);

            // Save the edge
            edgeRepository.save(edge);
            return new ResponseEntity<>(edge, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/edge/delete")
    public ResponseEntity<String> deleteEdge(@RequestBody TechniqueChainEdgeDTO request) {
        try {
            if (!edgeRepository.existsById(request.getEdgeToDelete())) {
                throw new IllegalArgumentException("Edge with ID " + request.getEdgeToDelete() + " does not exist");
            }
            edgeRepository.deleteById(request.getEdgeToDelete());
            return new ResponseEntity<>("Edge deleted successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete edge: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/weave/all")
    public ResponseEntity<List<TechniqueChainWeave>> getAllTechniqueWeaves() {
        List<TechniqueChainWeave> nodes = weaveRepository.findAll();
        return new ResponseEntity<>(nodes, HttpStatus.OK);
    }

    @PostMapping("/weave/create")
    public ResponseEntity<Object> createNewWeave(@RequestBody TechniqueChainWeave node) {
        TechniqueChainWeave newWeave = weaveRepository.save(node);
        return new ResponseEntity<>(newWeave, HttpStatus.OK);
    }

    @PutMapping("/weave/edit")
    public ResponseEntity<TechniqueChainWeave> updateWeave(@RequestBody TechniqueChainWeave updatedWeaveData) {
        TechniqueChainWeave updatedWeave = weaveService.updateWeave(updatedWeaveData.getId(), updatedWeaveData);
        if (updatedWeave != null) {
            return new ResponseEntity<>(updatedWeave, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/weave/{id}")
    public ResponseEntity<TechniqueChainWeave> getWeaveById(@PathVariable Long id) {
        Optional<TechniqueChainWeave> optionalWeave = weaveRepository.findById(id);
        if (optionalWeave.isPresent()) {
            TechniqueChainWeave weave = optionalWeave.get();
            // Eagerly fetch the edges if needed
            weave.getWeaveRepresentations().size();
            return new ResponseEntity<>(weave, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //lägga till så man kan hämta kedjor?
}
