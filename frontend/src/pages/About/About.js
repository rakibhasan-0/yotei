import React from "react"
import "./About.css"
import about from "./About.txt"

/**
 * This is the about page. The user can read information 
 * about the application on this page. The file containing 
 * the description of the application can be found at 
 * pages/About/About.txt(same folder as this file).
 * 
 * @author Team Quattro Formaggio (Group 1)
 * @version 1.0
 */
class About extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			fileData: null
		}
	}

	componentDidMount() {
		fetch(about)
			.then(r => r.text())
			.then(text => {
				this.setState(
					{fileData: text}
				)
			})
	}
    
	render() {
		return (
			<div>
				<div className="container about-container">
					<h1><u>Om Yotei</u></h1>
					{this.state.fileData}
				</div>
			</div>
		)
	}
}

export default About
