import React from 'react';
import "../Technique/TechniqueCreate.css";
import TechniqueForm from "../../components/Forms/TechniqueForm";
import {AccountContext} from "../../context"
import GoBackButton from "../../components/Common/GoBackButton";

 /**
  * Page for adding a technique.
  * 
  * @author Grupp 6 (Calskrove) (2022-05-19)
  */
class Technique extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            desc: '',
            tags: '',
            storedName: '',
            clickedButton: false,
            okName: true,
            insertFailed: false,         //indicates if insert has failed
            tagFailed: false,
            boxChecked: false,
            isChanged: false,            //isChanged and callBack values are used so we don't get an
                                        //alert when not changing anything in the exercise
            callBack : false,
            clearAlternative: false     //true if alternative to automatically clear should show

        };
        this.addTechnique = this.addTechnique.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkName = this.checkName.bind(this);
    }

    /**
     * Event handler for create. Used when submitting the form. Forces
     * re-rendering if there is an error or response from insert is not ok
     * @param e
     */
    async addTechnique() {
        let data = null;

        if (this.state.name !== undefined) {
            this.setState({storedName: this.state.name});
        } else {
            this.setState({storedName: ""});
        }

        const requestOptions = {
            method: "POST",
            headers: {'Content-type': 'application/json', 'token': this.context.token},
            body: JSON.stringify({name: this.state.name, description: this.state.desc, duration: this.state.time})
        };

        try {
            const response = await fetch(`/api/techniques/add`, requestOptions);
            if (response.ok) {
                data = await response.json();
                this.setState({insertFailed: false});
                this.forceUpdate();
            } else {
                if (response.status === 409) {
                    alert("Namnet '" + this.state.storedName + "' är upptaget.");
                }
                this.setState({insertFailed: true});
                this.setState({boxChecked: false})
            }
        } catch (error) {
            console.log("Error at technique insert");
            this.setState({insertFailed: true})
            this.forceUpdate();
        }
        return data.id;
    }

    /**
     * API call when creating a tag.
     * 
     * @returns the id of the technique that has been created
     */
    async addTag(id) {
        let tag_id = null;

        if (this.state.tags === undefined) {
            return this.state.tagFailed;
        }

        for (let i = 0; i < this.state.tags.length; i++) {
            if (this.state.tags[i].__isNew__) {
                const requestOptions = {
                    method: "POST",
                    headers: {'Content-type': 'application/json', 'token': this.context.token},
                    body: JSON.stringify({name: this.state.tags[i].label})
                };
                try {
                    const response = await fetch('/api/tags/add', requestOptions);
                    if (response.ok) {
                        const data = await response.json();
                        tag_id = data.id;
                        this.setState({tagFailed: false});
                        this.forceUpdate();
                    } else {
                        this.setState({tagFailed: true});
                        this.forceUpdate();
                    }
                } catch (error) {
                    console.log("Error at tag insert");
                    this.setState({tagFailed: true});
                    this.forceUpdate();
                }
            } else {
                tag_id = this.state.tags[i].value;
            }
            await this.linkTechniqueTag(id, tag_id);
        }
        return this.state.tagFailed
    }

    /**
     * API call when creating a tag.
     * 
     * @returns the id of the exercise that has been created
     */
    async linkTechniqueTag(tech_id, tag_id) {
        const requestOptions = {
            method: "POST",
            headers: {'Content-type': 'application/json', 'token': this.context.token},
            body: JSON.stringify({"techId": tech_id})
        };

        try {
            const response = await fetch('/api/tags/add/technique?tag=' + tag_id, requestOptions);
            if (response.ok) {
                this.setState({tagFailed: false});
                this.forceUpdate();
            } else {
                this.setState({tagFailed: true});
                this.forceUpdate();
            }
        } catch (error) {
            console.log("Error at tag link");
            this.setState({tagFailed: true})
            this.forceUpdate();
        }
    }

    /**
     * Updates the states each time an input is changed
     * @param changeObject
     */
    handleChange(changeObject) {
        this.setState(changeObject)
    }

    /**
     * Sets this state to data from the form.
     */
    handleCallback = (formData) => {
        if (this.state.callBack) {
            this.setState({isChanged: true})
        }
        this.setState({callBack: true})
        this.setState(formData);
    }

    /**
     * API calls in an ordered chain first creating the exercise, then the
     * required tags and last linking the exercise with the tags required.
     */
    addTechniqueAndTags = () => {
        this.setState({clickedButton: true});
        this.addTechnique().then((id) => this.addTag(id)).then((tag) => this.exit_prodc(tag));
    }

    /**
     * Validates the users input on name. If the input is invalid it will
     * send a signal to the form and change the input style.
     *
     * @returns Boolean
     */
    checkName() {
        if (this.state.okName === false) {
            if (this.state.name !== "" && this.state.name !== undefined) {
                this.setState({okName: true});
            }
        }

        if (this.state.clickedButton === true) {
            if (this.state.storedName === "") {
                this.setState({okName: false});
            } else {
                this.setState({clickedButton: false});
                this.setState({okName: true});
            }
            this.setState({clickedButton: false});
        }
        return this.state.okName;
    }


    /**
     * Checks if insert worked, if so redirect back to exercise.
     * @param tagFailed
     */
    exit_prodc(tagFailed) {
        if (this.state.insertFailed === false && this.state.tagFailed === false) {

            if (document.getElementById("checkbox").checked === false) {
                this.forceUpdate();

                window.location.href = "/technique";
            } else {
                if (document.getElementById('clearbox').checked) {
                    this.setState({name: ''});
                    this.setState({desc: ''});
                }
                this.setState({isChanged: false});
                this.setState({boxChecked: true});
                this.forceUpdate();
            }

        }

    }

    /**
     * Render - The main meat of the class, containing the general functionality.
     * The function is executed when going to or refreshing the page.
     * @returns A page for creating a technique.
     */
    render() {
        let failedAlert;    //should be true if insert failed
        let successAlert;

        if (this.state.insertFailed && this.state.clickedButton) {
            failedAlert = <div className="alert alert-danger"
                               role="alert">
                Tekniken {this.state.storedName} kunde ej läggas till
            </div>;
        }
        if (this.state.boxChecked) {
            successAlert = <div className="alert alert-success" role="alert">
                Tekniken {this.state.storedName} lades till
            </div>;
        } else {
            successAlert = '';
        }

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h2 className="display-4 text-center"><strong>Skapa teknik</strong></h2>
                        <TechniqueForm
                            techniqueCallback={this.handleCallback}
                            name={this.state.name}
                            desc={this.state.desc}
                            okName={this.checkName()}
                            resetTitle={"Rensa allt"}/>
                        {/*Button for the form. Calls the function addTechnique. Retrieve the users input*/}
                        <button className="btn btn-color btn-done" type='button'
                                onClick={(e) => this.addTechniqueAndTags(e)}>
                            Lägg till
                        </button>

                        <div> Lägg till fler tekniker  
                            <input className='stay-box' type="checkbox" id="checkbox" onChange={(e) => this.setState({clearAlternative: !this.state.clearAlternative})}/>
                        </div>
                        {this.state.clearAlternative ? 
                                <div className={this.state.clearAlternative ? '' : 'grey'}> 
                                    Rensa text <input className={this.state.clearAlternative ? 'stay-box' : 'stay-box grey-box'} type="checkbox" id="clearbox"/>
                                </div>
                            :
                                <div className={this.state.clearAlternative ? '' : 'grey'}> 
                                    Rensa text <input className={this.state.clearAlternative ? 'stay-box' : 'stay-box grey-box'} type="checkbox" id="clearbox" checked={false}/>
                                </div>
                        }

                        <GoBackButton confirmationNeeded={
                            !((this.state.name === undefined || this.state.name === '')
                                && (this.state.desc === undefined || this.state.desc === ''))
                            && this.state.isChanged}
                        />

                        {failedAlert}
                        {successAlert}
                    </div>
                </div>
            </div>
        );
    }
}

Technique.contextType = AccountContext

export default Technique;
