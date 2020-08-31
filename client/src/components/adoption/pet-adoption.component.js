import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";

class PetAdopt extends Component {
    constructor(props) {
       super(props);

       this.onChangeFirstName = this.onChangeFirstName.bind(this);
       this.onChangeLastName = this.onChangeLastName.bind(this);
       this.onChangeAddress = this.onChangeAddress.bind(this);
       this.onChangeEmail = this.onChangeEmail.bind(this);
       this.onSubmit = this.onSubmit.bind(this);
       this.onAdoptionComplete = this.onAdoptionComplete.bind(this);

       this.state = {
         firstName: '',
         lastName: '',
         address: '',
         email: '',
         errors: [],
         formSuccess: false,
         redirect: false,
         adoptionId: 0
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
    onChangeEmail(e) {
        this.setState({
          email: e.target.value
        })
    }
    onAdoptionComplete() {
        this.setState({
          redirect: true
        })
    }

    onSubmit(e) {
        e.preventDefault();
        console.log("Pet detail received in pet adoption comp");
        console.log(petDetail);
        const adoption = {
            pet: this.props.petDetail,
            owner: this.props.ownerDetail,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            email: this.state.email
        }
        this.setState({
          errors: []
        })

        console.log(adoption);

        axios.post('http://pethut.com/adoptions', adoption)
            .then((res) => {
                console.log(res);
                console.log("Adoption result : " + res.status);
                console.log("Adoption id : " + res.data.id);
                this.setState({
                  formSuccess: true,
                  adoptionId: res.data.id
                })
                setTimeout(() => {  this.onAdoptionComplete(); }, 1500);
            })
            .catch((err) => {
                console.log(err.response.data);
                this.setState({
                  errors: err.response.data.errors,
                  formSuccess: false,
                  adoptionId: 0
                })
            });

    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/adoptions/'+this.state.adoptionId} />;
        } else {
            return(
                <div className="content-div row">
                    {this.state.formSuccess === true && (
                        <div className="success-msg mb-3">
                            <p className="m-0 p-0">Adoption Completed Successfully!</p>
                        </div>
                    )}
                    <form style={{width: 97 + '%'}} onSubmit = {this.onSubmit}>
                        <h3 className="ml-3 mb-4">Adoption Form</h3>
                        <div className="form-group">
                            <label className="col-sm-3">First Name: </label>
                            <input type="text" className="col-sm-9" onChange={this.onChangeFirstName}/>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3">Last Name: </label>
                            <input type="text" className="col-sm-9" onChange={this.onChangeLastName}/>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3">Address: </label>
                            <input type="text" className="col-sm-9" onChange={this.onChangeAddress}/>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3">Email: </label>
                            <input type="text" className="col-sm-9" onChange={this.onChangeEmail}/>
                        </div>
                        {this.state.errors.length>0 && (
                            <div className="alert alert-danger">
                                <ul>
                                    {this.state.errors.map(err => <li key={err.msg}>{err.msg}</li>)}
                                </ul>
                            </div>
                        )}
                        <div className="mt-4">
                            <button type="submit" className="btn btn-info float-right">Submit</button>
                        </div>
                    </form>
                </div>
            )
        }
    }
};

export default PetAdopt;