import React, {Component} from 'react';
import axios from 'axios';

class EditPet extends Component {
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
          errors: [],
          imagePath: ''
        }
    }

    componentDidMount() {
        axios.get('http://pethut.com/pets/'+this.props.match.params.pet_id)
              .then(response => {
                this.setState({
                    name: response.data.name,
                    breed: response.data.breed,
                    gender: response.data.gender,
                    age: response.data.age,
                    vaccinated: response.data.vaccinated,
                    description: response.data.description,
                    image: response.data.image,
                    imagePath: response.data.image
                })
              })
              .catch(function (error) {
                console.log(error);
              });
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

        axios.put("http://pethut.com/owners/"+ this.props.match.params.owner_id + "/pets/" + this.props.match.params.pet_id, formData)
          .then(res => {
            console.log(res.data);
            this.setState({
              formSuccess: true
            })
            this.componentDidMount();
            //setTimeout(() => {  window.location = '/owners/' + this.props.match.params.id; }, 2000);

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
                        <p className="m-0 p-0">Pet Updated Successfully!</p>
                    </div>
                 )}
                <div className="mt-2 mb-4"><h2>Edit Pet Details</h2></div>
                <form className="pet-details" onSubmit = {this.onSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-2">Name: </label>
                        <input type="text" className="col-sm-10" value={this.state.name} onChange={this.onChangeName}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Breed: </label>
                        <input type="text" className="col-sm-10" value={this.state.breed} onChange={this.onChangeBreed}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Gender: </label>
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" name="inlineRadioOptions"
                              id="inlineRadio1" value="Male" onChange={this.onChangeGender} checked={this.state.gender === 'Male'}/>
                              <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" name="inlineRadioOptions"
                              id="inlineRadio2" value="Female" onChange={this.onChangeGender} checked={this.state.gender === 'Female'}/>
                              <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
                            </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2">Age (years): </label>
                        <input type="text" className="col-sm-10" value={this.state.age} onChange={this.onChangeAge}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Vaccinated: </label>
                        <input className="col-sm-2 mt-2" style={{marginLeft: -90 + 'px'}} type="checkbox" value="" onChange={this.onChangeVaccinated}
                        checked={this.state.vaccinated}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Description: </label>
                        <input type="text" className="col-sm-10" value={this.state.description} onChange={this.onChangeDescription}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2">Picture: </label>
                        <img className="rounded col-sm-2 p-0" src={'http://pethut.com/uploads/' + this.state.imagePath} alt="Pet" width="100%"/>
                        <input type="file" className="col-sm-8 form-control-file" name="image" accept="image/*" onChange={this.onChangeImage}/>
                    </div>

                    {this.state.errors.length>0 && (
                        <div className="alert alert-danger">
                            <ul>
                                {this.state.errors.map(err => <li key={err.msg}>{err.msg}</li>)}
                            </ul>
                        </div>
                    )}

                     <div className="form-group row">
                        <button type="submit" className="btn btn-info mt-4 ml-4">Update Pet</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default EditPet;