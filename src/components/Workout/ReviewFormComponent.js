import React from 'react';
import Ratings from 'react-ratings-declarative';
import './ReviewFormComponent.css';
import {AccountContext} from "../../context";
import Modal from "react-bootstrap/Modal";
import Button from "../Common/Button/Button";
import AlertWindow from "../Common/AlertWindow";

//should be 0 for the smileys to work
const UNINITIALIZED = 0;

/**
 * This component is used for adding and viewing reviews of workouts, it contains a rating between 1-5,
 * two text areas and a button to add the review.
 *
 * It also contains the previous reviews for the workout
 *
 * @author Squad 1-Phoenix (25/4-2023)
 */
class ReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEmpty: false,
            editRating: UNINITIALIZED,
            editPositiveComment: '',
            editNegativeComment: '',
            rating: UNINITIALIZED,
            workoutID: props.workoutID,
            positiveComment: '',
            negativeComment: '',
            reviews: []
        };

        this.changeRating = this.changeRating.bind(this);
        this.changeEditRating = this.changeEditRating.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.handleDeleteClose = this.handleDeleteClose.bind(this);
        this.handleEmptyClose = this.handleEmptyClose.bind(this);
    }

    /**
     * Change the saved rating when the smiley is clicked.
     *
     * @param {Ratings} newRating
     */
    changeRating(newRating) {
        this.setState({
            rating: newRating
        });
    }

    /**
     * Change the rating in the edit field.
     *
     * @param {*} newRating
     */
    changeEditRating(newRating) {

        this.setState({
            editRating: newRating
        });
    }

    /**
     * componentDidMount is called when the page is loaded.
     * This causes the previous reviews to be retrieved.
     */
    componentDidMount() {
        const requestOptions = {
            headers: {token: this.context.token}
        };
        fetch(`/api/workouts/reviews?id=${this.state.workoutID}`, requestOptions)
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    reviews: data.map(review => ({
                        id: review.review_id,
                        userId: review.user_id,
                        rating: review.rating,
                        positiveComment: review.positive_comment,
                        negativeComment: review.negative_comment,
                        workoutId: review.workout_id,
                        date: review.review_date.substring(0, 10),
                        username: review.username,
                        showEdit: false,
                        showDelete: false
                    }))
                })
            })
            .catch(console.log);
    }

    /**
     * Add a review to the database.
     *
     * This review is for the user currently logged in, and for the currently viewed workout.
     */
    async addReview() {
        let ts = this.getTodaysDate() + "T" + this.getCurrentTime();
        const requestOptions = {
            method: "POST",
            headers: {'Content-type': 'application/json', 'token': this.context.token},
            body: JSON.stringify({
                "workoutId": this.state.workoutID,
                "userId": this.context.userId,
                "rating": this.state.rating,
                "positiveComment": this.state.positiveComment,
                "negativeComment": this.state.negativeComment,
                'date': ts
            })
        };
        if (this.reviewIsValid()) {
            await fetch(`/api/workouts/reviews`, requestOptions)
                .then(() => window.location.reload(false))
                .catch(() => console.log);
        } else {
            this.setState({showEmpty: true})
        }

    }

    /**
     * A function used to send a request for editing a review.
     *
     * @param {review} id
     */
    async editReview(id) {
        let ts = this.getTodaysDate() + "T" + this.getCurrentTime();
        const requestOptions = {
            method: "PUT",
            headers: {'Content-type': 'application/json', 'token': this.context.token},
            body: JSON.stringify({
                "id": id,
                "workoutId": this.state.workoutID,
                "userId": this.context.userId,
                "rating": this.state.editRating,
                "positiveComment": this.state.positiveEditComment,
                "negativeComment": this.state.negativeEditComment,
                'date': ts
            })
        };
        if (this.editReviewIsValid()) {
            await fetch(`/api/workouts/reviews`, requestOptions)
                .then(resp => resp.json())
                .then(() => window.location.reload(false))
                .catch(() => console.log);
        } else {
            this.setState({showEmpty: true})
        }
    }

    /**
     * Handle a change in the state.
     *
     * @param {state} changeObject
     */
    handleChange(changeObject) {
        this.setState(changeObject);
    }

    /**
     * Returns todays date, in swedish
     * standard notation. Taken from WorkoutCreate.js
     * @returns todays date
     */
    getTodaysDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        return yyyy + '-' + mm + '-' + dd;
    }

    /**
     * Get current time. Taken from WorkoutFormComponent.
     * @returns current time
     */
    getCurrentTime() {
        let today = new Date();

        // Makes sure that we get the right format of the time
        let currHour = today.getHours().toString().padStart(2, '0')
        let currMin = today.getMinutes().toString().padStart(2, '0')
        let currSec = today.getSeconds().toString().padStart(2, '0')

        return currHour + ":" + currMin + ":" + currSec;
    }


    /**
     * @returns true if the edit to a review is valid (some field not empty), else false.
     */
    editReviewIsValid() {
        if (this.state.editRating !== UNINITIALIZED ||
            this.state.positiveEditComment !== '' || this.state.negativeEditComment !== '') {
            return true;
        }
        return false;
    }

    /**
     * @returns true if review is valid (some field not empty), else false
     */
    reviewIsValid() {
        if (this.state.rating !== UNINITIALIZED ||
            this.state.positiveComment !== '' || this.state.negativeComment !== '') {
            return true;
        }

        return false;
    }

    /**
     * A function for deleting a review. Sends a request to the API and deletes the item from
     * the list if successful.
     * @param comment
     * @returns {Promise<void>}
     */
    async deleteReview({review}) {
        const requestOptions = {
            method: "DELETE",
            headers: {'token': this.context.token}
        };

        const response = await fetch(`/api/workouts/reviews?id=${review.id}`, requestOptions);
        const data = await response;
        this.setState({showDeleteConfirm: false})
        if (data.status === 200) {
            window.location.reload(false);
        }
        this.forceUpdate()
    }

    /**
     * A function that takes a review and either returns a button with delete functionality or returns nothing depending
     * on who is logged in.
     *
     * @param {*} review
     * @returns A button or nothing.
     */
    deleteButtonFunc(review) {

        // Check if the logged in user has delete privileges.
        if (this.context.role === "ADMIN" || this.context.userId === review.userId) {
            return <button className='delete-btn btn btn-color' onClick={() => {
                review.showDelete = true;
                this.forceUpdate();
            }}>Ta bort utvärdering</button>
        }
        return
    }


    /**
     * A function that takes a review and either returns a button with edit functionality or returns nothing depending
     * on who is logged in.
     *
     * @param {*} review
     * @returns A button or nothing.
     */
    editButtonFunc(review) {

        if (this.context.userId === review.userId) {
            return <button className='edit-btn btn btn-color'
                           onClick={() => {
                               review.showEdit = true;
                               this.forceUpdate();
                           }}>
                Redigera utvärdering
            </button>
        }
        return
    }

    /**
     * A function that sets the warning window to not be shown.
     */
    handleEmptyClose() {
        this.setState({showEmpty: false});
        this.forceUpdate()
    }

    /**
     * A function that sets the edit page to not be shown.
     */
    handleEditClose(review) {

        review.showEdit = false;
        this.forceUpdate();
    }

    /**
     * Function that handles closing the delete alert.
     */
    handleDeleteClose(review) {

        review.showDelete = false;
        this.forceUpdate();
    }


    /**
     * A function that updates the edit fields when the edit mode is entered for a review.
     *
     * @param {review} review
     */
    handleEditShow(review) {

        this.setState({
            editRating: review.rating,
            positiveEditComment: review.positiveComment,
            negativeEditComment: review.negativeComment
        });
    }

    render() {
        return (
            <div className='review-box'>

                {/* Code for the 'add' part of the page. */}
                <h1>Lägg till utvärdering</h1>
                <Ratings
                    rating={this.state.rating}
                    widgetRatedColors="green"
                    changeRating={this.changeRating}
                >
                    <Ratings.Widget
                        svgIconViewBox="0 0 24 24"
                        svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-.941 9.94c-.903-.19-1.741-.282-2.562-.282-.819 0-1.658.092-2.562.282-1.11.233-1.944-.24-2.255-1.015-.854-2.131 1.426-3.967 4.816-3.967 3.537 0 5.666 1.853 4.817 3.968-.308.769-1.136 1.249-2.254 1.014zm-2.563-1.966c1.614 0 3.056.67 3.206.279.803-2.079-7.202-2.165-6.411 0 .138.377 1.614-.279 3.205-.279z"
                    />
                    <Ratings.Widget
                        svgIconViewBox="0 0 24 24"
                        svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.001 14c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                    />
                    <Ratings.Widget
                        svgIconViewBox="0 0 24 24"
                        svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                    />
                    <Ratings.Widget
                        svgIconViewBox="0 0 24 24"
                        svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                    />
                    <Ratings.Widget
                        svgIconViewBox="0 0 24 24"
                        svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 14h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm0-3.998l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002zm-7 0l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002z"
                    />
                </Ratings>
                <textarea type="text"
                          placeholder="Det postiva med detta pass"
                          className="form-control desc-form review-area"
                          onChange={(e) => this.handleChange({positiveComment: e.target.value})}></textarea>

                <textarea type="text"
                          placeholder="Det negativa med detta pass"
                          className="form-control desc-form review-area"
                          onChange={(e) => this.handleChange({negativeComment: e.target.value})}></textarea>

                <button className="btn btn-color btn-done review-btn" type='button'
                        onClick={() => this.addReview()}> Lägg till
                </button>

                <h1>Tidigare Utvärderingar</h1>
                {/* Code for the 'retrieve' part of the page. */}
                {this.state.reviews.map((review, i) => (


                    <div className='border-top' key={i}>
                        <h2>{review.username}</h2>
                        <h4 className={'review-date'}>{review.date}</h4>
                        <div className='prev'>
                            <Ratings
                                rating={review.rating}
                                widgetRatedColors="green">

                                <Ratings.Widget
                                    svgIconViewBox="0 0 24 24"
                                    svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-.941 9.94c-.903-.19-1.741-.282-2.562-.282-.819 0-1.658.092-2.562.282-1.11.233-1.944-.24-2.255-1.015-.854-2.131 1.426-3.967 4.816-3.967 3.537 0 5.666 1.853 4.817 3.968-.308.769-1.136 1.249-2.254 1.014zm-2.563-1.966c1.614 0 3.056.67 3.206.279.803-2.079-7.202-2.165-6.411 0 .138.377 1.614-.279 3.205-.279z"
                                />
                                <Ratings.Widget
                                    svgIconViewBox="0 0 24 24"
                                    svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.001 14c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                                />
                                <Ratings.Widget
                                    svgIconViewBox="0 0 24 24"
                                    svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                                />
                                <Ratings.Widget
                                    svgIconViewBox="0 0 24 24"
                                    svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                                />
                                <Ratings.Widget
                                    svgIconViewBox="0 0 24 24"
                                    svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 14h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm0-3.998l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002zm-7 0l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002z"
                                />
                            </Ratings>
                            <br/>

                            <svg className='icon-plus' xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24">
                                <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" className='plus'/>
                            </svg>
                            <p className='review-comment'>{review.positiveComment}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path className='minus'
                                      d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/>
                            </svg>
                            <p className='review-comment'>{review.negativeComment}</p>
                            {/* A function that will either return a button or nothing so that the review has appropriate functionality
                        for deleting it. */
                                this.deleteButtonFunc(review)}

                            <AlertWindow hideFunc={() => this.handleDeleteClose(review)}
                                         callback={() => this.deleteReview({review})}
                                         show={review.showDelete}
                                         title={"Ta bort"}
                                         body={"Vill du verkligen ta bort denna utvärdering?"}
                                         yesText={"Ja"}
                                         noText={"Nej"}
                            />

                            <AlertWindow hideFunc={this.handleEmptyClose}
                                         show={this.state.showEmpty}
                                         title={"Varning"}
                                         body={"Utvärderingen får inte vara tom!"}
                                         yesText={""}
                                         noText={"OK"}
                            />


                            {/* A function that will either return a button or nothing so that the review has appropriate functionality
                        for editing it. */
                                this.editButtonFunc(review)}

                            {/* Popup that is only shown when an edit button for reviews is pressed. This contains
                        the necessary fields for editing the specified review. */}
                            <>
                                <Modal
                                    show={review.showEdit}
                                    onHide={() => this.handleEditClose(review)}
                                    onShow={() => this.handleEditShow(review)}
                                    dialogClassName="editModal">
                                    <Modal.Header>
                                        {/* Header with some header text and a button to cancel editing. */}
                                        <Modal.Title>Redigera utvärdering</Modal.Title>
                                    </Modal.Header>

                                    {/* A body with the fields used for editing the review. */}
                                    <Modal.Body>
                                        <Ratings
                                            rating={this.state.editRating}
                                            widgetRatedColors="green"
                                            changeRating={this.changeEditRating}
                                        >
                                            <Ratings.Widget
                                                svgIconViewBox="0 0 24 24"
                                                svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-.941 9.94c-.903-.19-1.741-.282-2.562-.282-.819 0-1.658.092-2.562.282-1.11.233-1.944-.24-2.255-1.015-.854-2.131 1.426-3.967 4.816-3.967 3.537 0 5.666 1.853 4.817 3.968-.308.769-1.136 1.249-2.254 1.014zm-2.563-1.966c1.614 0 3.056.67 3.206.279.803-2.079-7.202-2.165-6.411 0 .138.377 1.614-.279 3.205-.279z"
                                            />
                                            <Ratings.Widget
                                                svgIconViewBox="0 0 24 24"
                                                svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.001 14c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                                            />
                                            <Ratings.Widget
                                                svgIconViewBox="0 0 24 24"
                                                svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                                            />
                                            <Ratings.Widget
                                                svgIconViewBox="0 0 24 24"
                                                svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"
                                            />
                                            <Ratings.Widget
                                                svgIconViewBox="0 0 24 24"
                                                svgIconPath="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 14h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm0-3.998l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002zm-7 0l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002z"
                                            />
                                        </Ratings>
                                        <textarea type="text"
                                                  placeholder="Det postiva med detta pass"
                                                  value={this.state.positiveEditComment}
                                                  className="form-control desc-form review-area"
                                                  onChange={(e) => this.handleChange({positiveEditComment: e.target.value})}></textarea>

                                        <textarea type="text"
                                                  placeholder="Det negativa med detta pass"
                                                  value={this.state.negativeEditComment}
                                                  className="form-control desc-form review-area"
                                                  onChange={(e) => this.handleChange({negativeEditComment: e.target.value})}></textarea>
                                    </Modal.Body>

                                    {/* A footer with buttons to either cancel or save the edit. */}
                                    <Modal.Footer>
                                        <Button
                                            onClick={() => this.editReview(review.id)}>
                                            Spara
                                        </Button>
                                        <Button
                                            onClick={() => this.handleEditClose(review)}>
                                            Avbryt
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        </div>
                    </div>
                ))}
            </div>


        );
    }
}

ReviewForm.contextType = AccountContext;
export default ReviewForm