import React from 'react';
import Contacts from './contacts';
import {Link} from "react-router-dom";
import { AccountContext } from '../../context';

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: []};
    }

    render() {
        return (
            <div>
                {/*Button for routing to the add technique page.*/}
                <Link to="/techniques/add">
                    <button className="btn btn-color btn-done" type='button'>
                        Lägg till
                    </button>
                </Link>
                <Contacts contacts={this.state.contacts} />
            </div>
        )
    }

    componentDidMount() {
        const requestOptions = {
            headers: {'Content-type': 'application/json', token: this.context.token}
        };
        fetch('http://jsonplaceholder.typicode.com/users', requestOptions)
            .then(res => res.json())
            .then((data) => {
                this.setState({ contacts: data })
            })
            .catch(console.log)
    }
}

Contact.contextType = AccountContext

export default Contact;