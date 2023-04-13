import React from "react";

/**
 * This is a simple image form to upload a picture to the server
 * Supported formats: BMP, GIF, JPG and PNG
 * 
 * @author Calskrove (2022-05-04)
 */
class ImageForm extends React.Component {
    constructor(props) {
        super(props);
        this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
    }

    onFileChangeHandler = (e) => {
        const file = e.target.files[0];
        if(file) {
            const formData = new FormData();
            formData.append('file', file);
            fetch('http://localhost:8080/api/exercises/image', {
                method: 'post',
                body: formData
            }).then(res => {
                if(res.ok) {
                    alert("File uploaded successfully.")
                } else {
                    alert("File uploaded failed. Supported formats: BMP, GIF, JPG and PNG")
                }
            });
        }
        
        

    };

    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                            <div className="form-group files color">
                                <label>Upload Your File </label>
                                <input type="file" className="form-control" name="file" onChange={this.onFileChangeHandler}/>
                            </div>
                    </div>
                </div>
            </div>
        )
      }

}
export default ImageForm