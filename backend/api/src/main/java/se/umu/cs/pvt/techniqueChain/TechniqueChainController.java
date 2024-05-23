package se.umu.cs.pvt.techniqueChain;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

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

    private TechniqueWeaveRepresentRepository weaveRepresentRepository;

    @Autowired
    public TechniqueChainController(TechniqueChainNodeRepository nodeRepository, TechniqueChainNodeService nodeService, TechniqueChainEdgesRepository edgeRepository, TechniqueChainWeaveRepository weaveRepository,
            TechniqueWeaveService weaveService, TechniqueChainChainRepository chainRepository, TechniqueChainChainService chainService, TechniqueWeaveRepresentRepository weaveRepresentRepository) {

        this.nodeRepository = nodeRepository;
        this.nodeService = nodeService;
        this.edgeRepository = edgeRepository;
        this.weaveRepository = weaveRepository;
        this.weaveService = weaveService;
        this.chainRepository = chainRepository;
        this.chainService = chainService;
        this.weaveRepresentRepository = weaveRepresentRepository;
    }

    protected TechniqueChainController() {}

    /**
     * Creates a node.
     * @param node the node to create.
     * @return The new created node.
     * @return HTTP-status code.
     * 
     * Example Body
      {
       "name": "skriver kommentarer",  //optional
       "description": "kollar så api create weave fungerar",   //optional
       "attack": false,
       "technique": 1,
       "participant": 1,
       "parentWeave": 1,
       "inChain": 1   //optional
      }
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
      {
       "id": 1,
       "name": "skriver kommentarer",  //optional
       "description": "kollar så api create weave fungerar",   //optional
       "attack": false,
       "technique": 1,
       "participant": 1,
       "parent_weave": 1,
       "in_chain": 2   //optional
      }
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
     * cant have any edges.
     */
    @DeleteMapping("/node/delete")
    public ResponseEntity<Void> deleteNode(@RequestBody DeleteNodeRequest node) {
        boolean deleted = nodeService.deleteNode(node.getDeleteNode());
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
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
    @GetMapping("/node/weave")      //funkar inte 
    public ResponseEntity<List<TechniqueChainNode>> getNodes(@RequestParam Long parentWeaveId) {
        List<TechniqueChainNode> nodes = nodeService.getNodesByParentWeaveId(parentWeaveId);
        for (TechniqueChainNode node : nodes) {
            // Eagerly fetch the edges if needed
            node.getOutgoingEdges().size();
        }
        return new ResponseEntity<>(nodes, HttpStatus.OK);
    }

    /**
     * gests a node.
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
      {
       "fromNodeId": 1,
       "toNodeId": 2
      }
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
      {
       "name": "khion wasa",
       "description": "jobbig"
      }
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
      {
       "id": 3,
       "name": "khion wasa",
       "description": "jobbig"
      }
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
     * gets a weave.
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
     * creates a new weave Representation.
     * @return HTTP-status code.
     * @return the weave object with its id and a array with all the nodes it contains.
     * 
     * example body
{
  "node_x_pos": 65,
  "node_y_pos": 44,
  "nodeId": 17,
  "techniqueWeaveId": 1
}
     */
    @PostMapping("/weaveRepresentation/create")
    public ResponseEntity<Object> createNewWeave(@RequestBody TechniqueWeaveRepresent weave) {

        TechniqueChainWeave parentWeave = weaveRepository.findById(weave.getTechniqueWeaveId())
                .orElseThrow(() -> new EntityNotFoundException("Parent weave not found with id: " + weave.getTechniqueWeaveId()));

        weave.setTechniqueWeave(parentWeave);
        TechniqueWeaveRepresent newWeave = weaveRepresentRepository.save(weave);
        return new ResponseEntity<>(newWeave, HttpStatus.OK);
    }

    /**
     * deletes a weave Representation.
     * @return HTTP-status code.
     * @return a string with a success text or an error.
     * 
     * example url
/api/techniquechain/weaveRepresentation/delete/2
     */
    @DeleteMapping("/weaveRepresentation/delete/{id}")
    public ResponseEntity<String> deleteWeaveRepresentation(@PathVariable Long id) {
        TechniqueWeaveRepresent representToDelete = weaveRepresentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("representation with inputed id weave not found!"));
        if(representToDelete != null) {
            weaveRepresentRepository.deleteById(id);
        }
        return ResponseEntity.ok("Representation deleted successfully");
    }

    /**
     * creates a new weave Representation.
     * @return HTTP-status code.
     * @return the weave object with its id and a array with all the nodes it contains.
     * 
     * example body and id of represent to change in url
{
  "node_x_pos": 65,
  "node_y_pos": 44,
}
     */
    @PutMapping("/weaveRepresentation/edit/{id}")
    public ResponseEntity<TechniqueWeaveRepresent> updateWeaveRepresentation(@PathVariable Long id, @RequestBody TechniqueWeaveRepresent updatedReprisentData) {

        TechniqueWeaveRepresent representToEdit = weaveRepresentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("representation with inputed id weave not found!"));
        representToEdit.setNode_x_pos(updatedReprisentData.getNode_x_pos());
        representToEdit.setNode_y_pos(updatedReprisentData.getNode_y_pos());
          
        TechniqueWeaveRepresent updatedRepresent = weaveRepresentRepository.save(representToEdit);
        return ResponseEntity.ok(updatedRepresent);
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

    /**
     * Creates a new chain
     * @return HTTP-status code.
     * @return all the weaves with its nodeInfo.
     * 
     * example body
{
    "name": "kedja kanske",
    "description": "vad kan man skriva här då?",
    "parentId": 1
}
    */
    @PostMapping("/chain/create")
    public ResponseEntity<Object> createNewChain(@RequestBody TechniqueChainChain chain) {

        TechniqueChainWeave parentWeave = weaveRepository.findById(chain.getParentId())
                .orElseThrow(() -> new EntityNotFoundException("Parent weave not found with id: " + chain.getParentId()));
        
        chain.setParent_weave_id(parentWeave);
        TechniqueChainChain newChain = chainRepository.save(chain);
        return new ResponseEntity<>(newChain, HttpStatus.OK);
    }

    /**
     * edits a chain
     * @return HTTP-status code.
     * @return all the chain with its Info.
     * 
     * example body
{
  "id": 5,
  "name": "kedja kanske edit",
  "description": "vad kan man skriva här då? edit"
}
    */
    @PutMapping("/chain/edit")
    public ResponseEntity<TechniqueChainChain> updatechain(@RequestBody TechniqueChainChain updatedChainData) {

        TechniqueChainWeave parentWeave = weaveRepository.findById(updatedChainData.getParentId())
                .orElseThrow(() -> new EntityNotFoundException("Parent weave not found with id: " + updatedChainData.getParentId()));
        
        updatedChainData.setParent_weave_id(parentWeave);

        TechniqueChainChain updatedWeave = chainService.updateChain(updatedChainData.getId(), updatedChainData);
        if (updatedWeave != null) {
            return new ResponseEntity<>(updatedWeave, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * gets a specific chain
     * @param request the chain to remove
     * @return HTTP-status code.
     * @return a string with an error or an success message.
     */
    @GetMapping("/chain/{id}")
    public ResponseEntity<TechniqueChainChain> getTechniqueChainWithNodes(@PathVariable Long id) {
        TechniqueChainChain techniqueChain = chainService.getTechniqueChainWithNodes(id);
        return ResponseEntity.ok(techniqueChain);
    }

    /**
     * deletes a chain.
     * @param request the chain to remove
     * @return HTTP-status code.
     * @return a string with an error or an success message.
     * 
     * Example Body
     * {
     *  "deleteChain": 2
     * }
     */
    @DeleteMapping("/chain/delete")
    public ResponseEntity<String> deleteChain(@RequestBody TechniqueChainDTO request) {
        try {
            if (!chainRepository.existsById(request.getDeleteChain())) {
                throw new IllegalArgumentException("Chain with ID " + request.getDeleteChain() + " does not exist");
            }
            chainRepository.deleteById(request.getDeleteChain());
            return new ResponseEntity<>("chain deleted successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete chain: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
