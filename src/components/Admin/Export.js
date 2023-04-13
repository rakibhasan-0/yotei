import React from 'react'
import Button from 'react-bootstrap/Button'
import { AccountContext } from '../../context';
import Form from 'react-bootstrap/Form';
import './AdminComponent.css';

/**
 * Component made for the admin page. Made to handle the export 
 * feature on the front-end.
 *
 *  @author Team Quattro Formaggi (Group 1), Team Calzone (Group 4)
 */

class Export extends React.Component {
    /**
     * Constructor.
     * Maps functions.
     */
    constructor(props) {
      super(props);
      this.exportExercises = this.exportExercises.bind(this)
      this.exportTechniques = this.exportTechniques.bind(this)
    }
    
    /**
     * When the components are ready fetch references to them.
     */
    componentDidMount() {
        this.statusExportExercise = document.getElementById("status-export-exercise")
        this.statusExportTechnique = document.getElementById("status-export-technique")
    }

    /**
     * Defines the html for the component.
     */
    render() {
        return (
        <Form className='mt-5'>
            <h2>Export</h2>
            <Form.Group className="row">
                <div className='admin-container container-fluid'>
                    <p id='status-export-exercise' className='status-admin' ></p>
                </div>
            </Form.Group>
            <Form.Group className="row">
                <Button className="btn btn-admin btn-color container-fluid"
                        type="button"
                        onClick={this.exportExercises}>
                    Exportera Övningar
                </Button>
            </Form.Group>
            <Form.Group className="row">
                <div className='admin-container container-fluid'>
                    <p id='status-export-technique' className='status-admin' ></p>
                </div>
            </Form.Group>
            <Form.Group className="row">
                <Button className="btn btn-admin btn-color container-fluid"
                        type="button"
                        onClick={this.exportTechniques}>
                    Exportera Tekniker
                </Button>
            </Form.Group>
        </Form>
        );
    }

    /**
     * On click method for 'Exportera Övningar' button.
     * Exports Exercise data to .json file.
     * @see exportData
     */
    exportExercises() {
        const type = "exercises"
        this.exportData(type)
    }


    /**
     * On click method for 'Exportera Tekniker' button.
     * Exports Technique data to .json file.
     * @see exportData
     */
    exportTechniques() {
        const type = "techniques"
        this.exportData(type)
    }

    /**
     * Manages export data from back-end.
     * @param {String} type either exercise or technique,
     *                      identifies what will be exported.
     */
    async exportData(type) {
        const activityPath = `/api/${type}/all`
        const activityRequestOptions = {
            method: 'GET',
            headers:{token: this.context.token}
        }
        var tagPath = `/api/tags/export/${type}?${type === 'exercises' ? 'exerciseIds=' : 'techniqueIds='}`
        const tagRequestOptions = {
            method: 'GET',
            headers:{token: this.context.token}
        }
        this.sendData(activityPath, activityRequestOptions, tagPath, tagRequestOptions, type)
    };

    /**
     * Sends data to the back-end.
     * @param {String} activityPath back-end destination for activity
     * @param {JSON} activityRequestOptions options for the export request of activities
     * @param {String} tagPath part of destination for tags
     * @param {JSON} tagRequestOptions options for the export request of tags
     * @param {String} type either exercise or technique,
     *                      identifies type of activity will be exported.
     */
     async sendData(activityPath, activityRequestOptions, tagPath, tagRequestOptions, type) {
        const statusLabel = this.chooseStatusLabel(type === "exercises")
        const activityResponse = await fetch(activityPath, activityRequestOptions)
        if (activityResponse.ok === false) {
            this.responseUpdateStatus(activityResponse, statusLabel)
            return;
        }
        const activityData = await activityResponse.json()
        const tagRequestParams = await this.createTagRequestParams(activityData)
        const tagResponse = await fetch(`${tagPath}${tagRequestParams}`, tagRequestOptions)
        if (tagResponse.ok === false) {
            this.responseUpdateStatus(tagResponse, statusLabel)
            return
        }
        const tagData = await tagResponse.json()
        const data = this.compileExportData(activityData, tagData)
        if (activityResponse.ok && tagResponse.ok) {
            this.responseUpdateStatus(activityResponse, statusLabel)
            this.downloadData(data, type)
        }
    }

    /**
     * Chooses a label to display statuses depending on given boolean
     * @param {Boolean} activityIsExercises if the activity type is exercises
     * @returns a HTML element for which should display statuses.
     */
    chooseStatusLabel(activityIsExercises) {
        return activityIsExercises ? this.statusExportExercise : this.statusExportTechnique
    }

    /**
     * Creates the parameters for the request for exporting tags.
     * @param {JSON} activityData the fetched activity data.
     * @returns list of ids of activities which tags is needed. 
     *          Should be used as parameter for the export call for tags.
     */
    async createTagRequestParams(activityData) {
        var ids = []
        for (let index = 0; index < Object.keys(activityData).length; index++) {
            ids.push(activityData[index].id);
            delete activityData[index].id
        }
        return ids
    }

    /**
     * Compiles the fetched activity data and tag data to one JSON
     * object of export data.
     * @param {JSON} activityData the fetched activity data
     * @param {JSON} tagData the fetched tag data
     * @returns Compiled export data.
     */
    compileExportData(activityData, tagData) {
        var data = activityData
        for (let index = 0; index < Object.keys(data).length; index++) {
            data[index].tags = tagData[index]
        }
        return data
    }

    /**
     * Manages downloading of fetched data.
     * @param {JSON} data fetched data.
     * @param {String} type either exercise or technique,
     *                      identifies what has been exported.
     */
    async downloadData(data, type) {
        const formatedData = {
            [type]:data
        };
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(formatedData, null, 4)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = type + ".json";
        link.click();
    }

    /**
     * Handles status messages for responses.
     * @param {Response} response response from request.
     * @param {HTMLParagraphElement} statusLabel display the status.
     */
    responseUpdateStatus(response, statusLabel){
        if (response.ok) {
            this.changeStatus(statusLabel, "", "#fff")
        }
        else {
            if (response.status === 404) {
                this.changeStatus(statusLabel, "Server hittades inte", "#f00")
            }
            else {
                this.changeStatus(statusLabel, "Misslyckades med att exportera", "#f00")
            }
        }
    }

    /**
     * Changes text and color on a status label.
     * @param {HTMLParagraphElement} statusLabel status label to change.
     * @param {String} text text to set on the status label.
     * @param {String} color color(rgb hex) to set on the status label.
     */
    changeStatus(statusLabel, text, color) {
        statusLabel.innerHTML = text
        statusLabel.style.color = color;
    }
}

Export.contextType = AccountContext

export default Export