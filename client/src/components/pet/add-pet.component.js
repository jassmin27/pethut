import React, {Component} from 'react';
import axios from 'axios';

class AddPet extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeBreed = this.onChangeBreed.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
        this.onChangeAge = this.onChangeAge.bind(this);
        this.onChangeVaccinated = this.onChangeVaccinated.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
          name: '',
          breed: '',
          gender: '',
          age: '',
          vaccinated: false,
          description: '',
          image: '',
          formSuccess: false,
          errors: []
        }
    }
    onChangeName(e) {
        this.setState({
          name: e.target.value
        })
    }
    onChangeBreed(e) {
        this.setState({
          breed: e.target.value
        })
    }
    onChangeGender(e) {
        this.setState({
          gender: e.target.value
        })
    }
    onChangeAge(e) {
        this.setState({
          age: e.target.value
        })
    }
    onChangeVaccinated(e) {
        this.setState({
          vaccinated: e.target.checked
        })
    }
    onChangeDescription(e) {
        this.setState({
          description: e.target.value
        })
    }
    onChangeImage(e) {
        this.setState({
          image: e.target.files[0]
        })
    }
    onSubmit(e) {
        e.preventDefault();

        const pet = {
            name: this.state.name,
            breed: this.state.breed,
            gender: this.state.gender,
            age: this.state.age,
            vaccinated: this.state.vaccinated,
            description: this.state.description
        }
        this.setState({
          errors: []
        })
        const formData = new FormData();
        formData.append('image', this.state.image);
        Object.keys(pet).forEach(key => {
            formData.append(key, pet[key])
        });

        console.log(pet);

        axios.post("http://pethut.com/owners/"+ this.props.match.params.owner_id + "/pets", formData)
          .then(res => {
            console.log(res.data);
            this.setState({
              formSuccess: true
            })
            setTimeout(() => {  window.location = '/owners/' + this.props.match.params.owner_id; }, 2000);

          })
          .catch( err => {
              console.log(err.response.data);
              this.setState({
                errors: err.response.data.errors,
                formSuccess: false
              })
            });
    }

    render() {
        return(
            <div className="my-4 div-width">
                {this.state.formSuccess === true && (
                    <div className="success-msg mb-3">
                        <p className="m-0 p-0">Pet Added Successfully!</p>
                    </div>
                 )}
                <div className="mt-2 mb-4"><h2>Add Pet</h2></div>
                <form className="pet-details" onSubmit = {this.onSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-2">Name: </label>
                        <input type="text" className="col-sm-10" onChange={this.onChangeName}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Breed: </label>
                        <input type="text" className="col-sm-10" onChange={this.onChangeBreed}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Gender: </label>
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" name="inlineRadioOptions"
                              id="inlineRadio1" value="Male" onChange={this.onChangeGender} />
                              <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" name="inlineRadioOptions"
                              id="inlineRadio2" value="Female" onChange={this.onChangeGender} />
                              <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
                            </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2">Age (years): </label>
                        <input type="text" className="col-sm-10" onChange={this.onChangeAge}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Vaccinated: </label>
                        <input className="col-sm-2 mt-2" style={{marginLeft: -90 + 'px'}} type="checkbox" value="" onChange={this.onChangeVaccinated}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Description: </label>
                        <input type="text" className="col-sm-10" onChange={this.onChangeDescription}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Picture: </label>
                        <input type="file" className="col-sm-10 form-control-file" name="image" accept="image/*" onChange={this.onChangeImage}/>
                    </div>

                    {this.state.errors.length>0 && (
                        <div className="alert alert-danger">
                            <ul>
                                {this.state.errors.map(err => <li key={err.msg}>{err.msg}</li>)}
                            </ul>
                        </div>
                    )}

                     <div className="form-group row">
                        <button type="submit" className="btn btn-info ml-3 mt-4">Add Pet</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddPet;