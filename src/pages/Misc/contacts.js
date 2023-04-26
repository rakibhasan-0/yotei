import React from "react"

const Contacts = ({ contacts }) => {

	return (
		<div>
			<center>
				<h2>Contact List</h2>
				<p>Data retrieved from a json:</p>
				<p>`&apos;`http://jsonplaceholder.typicode.com/users`&apos;`</p>
			</center>
			{contacts.map((contact) => (
				<div className="card" key={contact}>
					<div className="card-body">
						<h5 className="card-title">{contact.name}</h5>
						<h6 className="card-subtitle mb-2 text-muted">{contact.email}</h6>
						<p className="card-text">{contact.company.catchPhrase}</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default Contacts