import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";

class AddOwner extends Component {
    constructor(props) {
        super(props);
        
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onAddComplete = this.onAddComplete.bind(this);

        this.state = {
          firstName: '',
          lastName: '',
          address: '',
          phone: '',
          email: '',
          errors: [],
          formSuccess: false,
          redirect: false,
          ownerId: 0
        }
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

    onAddComplete() {
        this.setState({
          redirect: true
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
        this.setState({
          errors: []
        })
        console.log(owner);

        axios.post('http://pethut.com/owners', owner)
          .then(res => {
            console.log("Id returned : " + res.data.id);
            this.setState({
              formSuccess: true,
              ownerId: res.data.id
            })
            setTimeout(() => {  this.onAddComplete(); }, 1500);
          })
          .catch( err => {
            console.log(err.response.data);
            this.setState({
              errors: err.response.data.errors,
              formSuccess: false,
              redirect: false,
              ownerId: 0
            })

          });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/owners/' + ownerId} />;
        } else {
            return(
                <div className="my-4 div-width">
                     {this.state.formSuccess === true && (
                        <div className="success-msg mb-3">
                            <p className="m-0 p-0">Owner Added Successfully!</p>
                        </div>
                     )}
                    <form onSubmit = {this.onSubmit}>
                        <div className="form-group row mr-0">
                            <label className="col-sm-2">First Name: </label>
                            <input type="text" className="col-sm-10" onChange={this.onChangeFirstName}/>
                        </div>
                        <div className="form-group row mr-0">
                            <label className="col-sm-2">Last Name: </label>
                            <input type="text" className="col-sm-10" onChange={this.onChangeLastName}/>
                        </div>
                        <div className="form-group row mr-0">
                            <label className="col-sm-2">Address: </label>
                            <input type="text" className="col-sm-10" onChange={this.onChangeAddress}/>
                        </div>
                        <div className="form-group row mr-0">
                            <label className="col-sm-2">Phone: </label>
                            <input type="text" className="col-sm-10" onChange={this.onChangePhone}/>
                        </div>
                        <div className="form-group row mr-0">
                            <label className="col-sm-2">Email: </label>
                            <input type="text" className="col-sm-10" onChange={this.onChangeEmail}/>
                        </div>

                        {this.state.errors.length>0 && (
                            <div className="alert alert-danger">
                                <ul>
                                    {this.state.errors.map(err => <li key={err.msg}>{err.msg}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="form-group row mr-0 ml-1 mt-4">
                            <button type="submit" className="btn btn-info">Add Owner</button>
                        </div>
                    </form>

                </div>
            );
        }
    }
}

export default AddOwner;