import React, {Component} from 'react';
import PetsListPerOwner from '../pet/list-pets-for-owner.component.js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

class EditOwner extends Component {
    constructor(props) {
        super(props);
        
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
          firstName: '',
          lastName: '',
          address: '',
          phone: '',
          email: '',
          errors: [],
          pets: [],
          formSuccess: false
        }
    }

    componentDidMount() {
        axios.get('http://pethut.com/query/owners/'+this.props.match.params.owner_id)
              .then(response => {

                this.setState({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    address: response.data.address,
                    phone: response.data.phone,
                    email: response.data.email,
                    pets: response.data.pets
                })
              })
              .catch(function (error) {
                console.log(error);
              });
    }

    onChangeFirstName(e) {
        this.setState({
          firstName: e.target.value
        })
    }
    onChangeLastName(e) {
         this.setState({
           lastName: e.target.value
         })
    }
    onChangeAddress(e) {
         this.setState({
           address: e.target.value
         })
    }
    onChangePhone(e) {
        this.setState({
          phone: e.target.value
        })
    }
    onChangeEmail(e) {
        this.setState({
          email: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const owner = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phone: this.state.phone,
            email: this.state.email
        }

        console.log(owner);

        axios.put('http://pethut.com/owners/' + this.props.match.params.owner_id, owner)
          .then(res => {
            console.log(res.data);
            this.setState({
              formSuccess: true
            })
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
            <div className="my-4 edit-owner div-width">
                {this.state.formSuccess === true && (
                    <div className="success-msg mb-3">
                        <p className="m-0 p-0">Owner Updated Successfully!</p>
                    </div>
                 )}
                <h1 className="mb-4">Owner Information</h1>
                <form onSubmit = {this.onSubmit}>
                    <div className="form-group row mr-0">
                        <label className="col-sm-2">First Name: </label>
                        <input type="text" className="col-sm-10" value={this.state.firstName} onChange={this.onChangeFirstName}/>
                    </div>
                    <div className="form-group row mr-0">
                        <label className="col-sm-2">Last Name: </label>
                        <input type="text" className="col-sm-10" value={this.state.lastName} onChange={this.onChangeLastName}/>
                    </div>
                    <div className="form-group row mr-0">
                        <label className="col-sm-2">Address: </label>
                        <input type="text" className="col-sm-10" value={this.state.address} onChange={this.onChangeAddress}/>
                    </div>
                    <div className="form-group row mr-0">
                        <label className="col-sm-2">Phone: </label>
                        <input type="text" className="col-sm-10" value={this.state.phone} onChange={this.onChangePhone}/>
                    </div>
                    <div className="form-group row mr-0">
                        <label className="col-sm-2">Email: </label>
                        <input type="text" className="col-sm-10" value={this.state.email} onChange={this.onChangeEmail}/>
                    </div>

                    {this.state.errors.length>0 && (
                        <div className="alert alert-danger">
                            <ul>
                                {this.state.errors.map(err => <li key={err.msg}>{err.msg}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="form-group row mr-0 mt-4">
                        <button type="submit" className="btn btn-info ml-3">Update Owner</button>
                        <NavLink className="internal-link" to={this.props.match.params.owner_id+'/pets/new'}>
                            <button type="button" className="btn btn-info ml-2 add-pet-btn">
                                <FontAwesomeIcon className="icon-svg mr-1" icon={faPlus} size="1x"/>
                                Add Pet
                            </button>
                        </NavLink>
                    </div>
                </form>


                <div className="pets-container">
                    <h1 className="mt-4">Pets</h1>
                    <PetsListPerOwner pets={this.state.pets}/>
                </div>

            </div>
        );
    }
}

export default EditOwner;    