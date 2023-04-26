import { useState } from "react"
import Badge from "react-bootstrap/Badge"
import Table from "react-bootstrap/Table"
import { Trash, List } from "react-bootstrap-icons"

//            This component is just a placeholder for now, no
//            real functionality has yet been added
/**
 * This component is used in the create
 * new workout page and represents the table
 * that contains the exercises/techniques etc
 * that the workout contains.
 * 
 * @author Team Kebabpizza (Group 8)
 * 
 * @version 1.0
 */
function WorkoutTableComponent(props){
	const [value, setValue] = useState([])
	/**
     * Testing purposes
     * @param {*} index index
     */
	function testDelete(index){        
		let test = []
		for (let i = 0; i < value.length; i++){
			if (i !== index){
				test.push({name: "övning", duration: "2"})
			}
		}
		setValue(test)
	}

	/**
     * Function that determines how
     * the data in the table should be rendered
     * @param {*} obj object in table
     * @param {*} index  index
     * @returns 
     */
	function renderData(obj, index){
		return (
			<tr key={index}>
				<td><List /></td>
				<td>{obj.name}</td>
				<td>{obj.duration}</td>
				<td><Trash onClick={() => {
					testDelete(index)
				}}/></td>
			</tr>
		)
	}

	return (
		<div style={{border:"solid rgba(0, 0, 0, 0.200) 1px", borderRadius: "0.2rem"}}>
			<h5 style={{marginTop: "1rem"}}>Övningar och Tekniker</h5>
                        
			<Table>
				<tbody>
					{props.data.map(renderData)}
				</tbody>
			</Table>

			{/*A div with two buttons, add exercise and add text*/}
			<div style={{borderTop: "solid 1px rgba(0,0,0,0, 0.200)"}}>

				{/*Button add text*/}
				<Badge bg="danger" text="white" style={{ marginTop: "0.5rem", marginBottom: "0.5rem"}}>
                    + Fri text
				</Badge>{" "}

				{/*Button add exercise*/}
				<Badge bg="danger" text="white" style={{ marginTop: "0.5rem", marginBottom: "0.5rem"}}>
                    + Aktivitet
				</Badge>{" "}
			</div>
		</div>
	)
}

export default WorkoutTableComponent