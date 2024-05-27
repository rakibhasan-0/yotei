import { Handle, Position, useStore } from "reactflow"
/**
*	Custom node component used to illustrate a technique weave.
* @author Durian Team 3
* @version 1.0
* @since 2024-05-20
*/

const connectionNodeIdSelector = (state) => state.connectionNodeId


export default function CustomNode({ data }) {
	const connectionNodeId = useStore(connectionNodeIdSelector)
	console.log("id " + data.id + " ownName " + data.ownName + " technique name " + data.name + " attack? " + data.attack)
	const backgroundColor = data.participant === 1 ? "lightblue" : "lightgreen"
	const text = data.ownName ? data.ownName : data.name
	const isConnecting = !!connectionNodeId
	const isTarget = connectionNodeId && connectionNodeId !== data.id
	const label = text

	return (
		<div className="customNode">
			<div
				className="customNodeBody"
				style={{
					borderStyle: isTarget ? "dashed" : "solid",
					borderColor: data.attack ? "black" : "white",
					backgroundColor: isTarget ? "#ffcce3" : backgroundColor,
				}}
			>
				{!isConnecting && (
					<Handle className="customHandle" position={Position.Right} type="source" />
				)}

				<Handle
					className="customHandle"
					position={Position.Left}
					type="target"
					isConnectableStart={false}
				/>
				{label}
			</div>
		</div>
	)
}
