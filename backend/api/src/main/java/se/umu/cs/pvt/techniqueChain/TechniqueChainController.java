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

    private TechniqueChainChainRepository chainRepository;
    private TechniqueChainChainService chainService;

    @Autowired
    public TechniqueChainController(TechniqueChainNodeRepository nodeRepository, TechniqueChainNodeService nodeService, TechniqueChainEdgesRepository edgeRepository, TechniqueChainWeaveRepository weaveRepository,
            TechniqueWeaveService weaveService, TechniqueChainChainRepository chainRepository, TechniqueChainChainService chainService) {

        this.nodeRepository = nodeRepository;
        this.nodeService = nodeService;
        this.edgeRepository = edgeRepository;
        this.weaveRepository = weaveRepository;
        this.weaveService = weaveService;
        this.chainRepository = chainRepository;
        this.chainService = chainService;
    }

    protected TechniqueChainController() {}

    /**
     * Creates a node.
     * @param node the node to create.
     * @return The new created node.
     * @return HTTP-status code.
     * 
     * Example Body
     * {
     *  "name": "skriver kommentarer",  //optional
     *  "description": "kollar så api create weave fungerar",   //optional
     *  "attack": false,
     *  "technique": 1,
     *  "participant": 1,
     *  "parentWeave": 1,
     *  "in_chain": 2   //optional
     * }
     */
    @PostMapping("/node/create")
    public ResponseEntity<Object> createNewNode(@RequestBody TechniqueChainNode node) {
        TechniqueChainNode newNode = nodeRepository.save(node);
        return new ResponseEntity<>(newNode, HttpStatus.OK);
    }

    /**
     * edits a node.
     * @param node the node to chage.
     * @return The edited node data.
     * @return HTTP-status code.
     * 
     * Example Body
     * {
     *  "id": 1,
     *  "name": "skriver kommentarer",  //optional
     *  "description": "kollar så api create weave fungerar",   //optional
     *  "attack": false,
     *  "technique": 1,
     *  "participant": 1,
     *  "parent_weave": 1,
     *  "in_chain": 2   //optional
     * }
     */
    @PutMapping("/node/edit")
    public ResponseEntity<TechniqueChainNode> updateNode(@RequestBody TechniqueChainNode updatedNodeData) {
        TechniqueChainNode updatedNode = nodeService.updateNode(updatedNodeData.getId(), updatedNodeData);
        if (updatedNode != null) {
            return new ResponseEntity<>(updatedNode, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * deletes a node.
     * @param node the node to delete.
     * @return HTTP-status code.
     * 
     * Example Body
     * {
     *  "deleteNode": 1
     * }
     */
    @DeleteMapping("/node/delete")
    public ResponseEntity<Void> deleteNode(@RequestBody DeleteNodeRequest node) {
        boolean deleted = nodeService.deleteNode(node.getDeleteNode());
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * gets all nodes that are in a specifyed weave.
     * @param parentWeaveId the weave to get all nodes to
     * @return HTTP-status code.
     * 
     * Example url
     * /api/techniquechain/node/weave?parentWeaveId=1
     */
    @GetMapping("/node/weave")
    public ResponseEntity<List<TechniqueChainNode>> getNodes(@RequestParam Long parentWeaveId) {
        List<TechniqueChainNode> nodes = nodeService.getNodesByParentWeaveId(parentWeaveId);
        for (TechniqueChainNode node : nodes) {
            // Eagerly fetch the edges if needed
            node.getOutgoingEdges().size();
        }
        return new ResponseEntity<>(nodes, HttpStatus.OK);
    }

    /**
     * deletes a node.
     * @param node the node to delete.
     * @return HTTP-status code.
     * @return the node with the input id.
     */
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

    /**
     * creates a edge.
     * @param edgeDTO the edge to create.
     * @return HTTP-status code.
     * @return the two nodes that get connected.
     * 
     * Example Body
     * {
     *  "fromNodeId": 1,
     *  "toNodeId": 2
     * }
     */
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

    /**
     * deletes a edge.
     * @param request the edge to create.
     * @return HTTP-status code.
     * @return string with text "edge deleted successfully".
     * 
     * Example Body
     * {
     *  "edgeToDelete": 1
     * }
     */
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

    /**
     * gets all the weaves.
     * @return HTTP-status code.
     * @return all the weaves with its nodeInfo.
     */
    @GetMapping("/weave/all")
    public ResponseEntity<List<TechniqueChainWeave>> getAllTechniqueWeaves() {
        List<TechniqueChainWeave> nodes = weaveRepository.findAll();
        return new ResponseEntity<>(nodes, HttpStatus.OK);
    }

    /**
     * creates a weave.
     * @param request the weave to create.
     * @return HTTP-status code.
     * @return the new weave object with its id.
     * 
     * Example Body
     * {
     *  "name": "khion wasa",
     *  "description": "jobbig"
     * }
     */
    @PostMapping("/weave/create")
    public ResponseEntity<Object> createNewWeave(@RequestBody TechniqueChainWeave weave) {
        TechniqueChainWeave newWeave = weaveRepository.save(weave);
        return new ResponseEntity<>(newWeave, HttpStatus.OK);
    }

    /**
     * edits a weave.
     * @param request the weave to edit.
     * @return HTTP-status code.
     * @return the edited weave object with its id and a array with all the nodes it contains.
     * 
     * Example Body
     * {
     *  "id": 3,
     *  "name": "khion wasa",
     *  "description": "jobbig"
     * }
     */
    @PutMapping("/weave/edit")
    public ResponseEntity<TechniqueChainWeave> updateWeave(@RequestBody TechniqueChainWeave updatedWeaveData) {
        TechniqueChainWeave updatedWeave = weaveService.updateWeave(updatedWeaveData.getId(), updatedWeaveData);
        if (updatedWeave != null) {
            return new ResponseEntity<>(updatedWeave, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * edits a weave.
     * @param id the weave id to get.
     * @return HTTP-status code.
     * @return the weave object with its id and a array with all the nodes it contains.
     */
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

    /**
     * gets all the weaves.
     * @return HTTP-status code.
     * @return all the weaves with its nodeInfo.
     */
    @GetMapping("/chain/all")
    public ResponseEntity<List<TechniqueChainChain>> getAllTechniqueChains() {
        List<TechniqueChainChain> chains = chainRepository.findAll();
        return new ResponseEntity<>(chains, HttpStatus.OK);
    }

    @PostMapping("/chain/create")
    public ResponseEntity<Object> createNewChain(@RequestBody TechniqueChainChain chain) {
        TechniqueChainChain newChain = chainRepository.save(chain);
        return new ResponseEntity<>(newChain, HttpStatus.OK);
    }

    @PutMapping("/chain/edit")
    public ResponseEntity<TechniqueChainChain> updatechain(@RequestBody TechniqueChainChain updatedChainData) {
        TechniqueChainChain updatedWeave = chainService.updateChain(updatedChainData.getId(), updatedChainData);
        if (updatedWeave != null) {
            return new ResponseEntity<>(updatedWeave, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/chain/{id}")
    public ResponseEntity<TechniqueChainChain> getChainById(@PathVariable Long id) {
        Optional<TechniqueChainChain> optionalWeave = chainRepository.findById(id);
        if (optionalWeave.isPresent()) {
            TechniqueChainChain chain = optionalWeave.get();
            // Eagerly fetch the edges if needed
            chain.getNodes().size();
            return new ResponseEntity<>(chain, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
