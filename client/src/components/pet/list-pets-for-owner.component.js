import React, { useState } from 'react';
import Pet from './pet.component.js';
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const PetsListPerOwner = (props) => {

    // Pets Deleted
    const [petsRender, setPetsRender] = useState(0);
    const handlePetRender = () => {
        //remove pet from props.pets array
        props.pets.forEach( (pet, index) => {
                console.log("Pet ID : " + pet._id);
                if(pet._id === selectedPet.id) {
                    props.pets.splice(index, 1);
                }
            }
        );
        setPetsRender(petsRender => ++petsRender);
    }

    // Selected Pet
    const [selectedPet, setSelectedPet] = useState(false);
    // Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setSelectedPet(e.target);
        setShow(true);
    }
    // Success on Deletion
    const [deleteSuccess, setDeleteSuccess ] = useState(false);
    const handleSuccess = () => setDeleteSuccess(!deleteSuccess);

    let params = useParams();
    const editPet = (e) => {
        setSelectedPet(e.target);
        console.log("Pet ID : " + e.target);
        window.location = window.location.href + '/pets/' + e.target.id;
    };

    const deletePet = () => {
        handleClose();
        axios.delete('http://pethut.com/owners/' + params.owner_id + '/pets/' + selectedPet.id)
            .then((res) => {
                console.log(res);
                // Delete Pet div
                handlePetRender();
                // Show success msg
                handleSuccess();
            })
            .catch(err => console.log(err.response.data));

    };

    return(

        <div className="mb-4">
            <span style={{ display: "none" }}>{petsRender}</span>
            {props.pets.length===0 && (
                <p>No pets listed</p>
            )}
            {deleteSuccess && (
                <div className="success-msg mb-3 pet-deleted" >
                    <p className="m-0 p-0">Pet Deleted Successfully!</p>
                </div>
            )}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Pet Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to delete this pet?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={deletePet}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {Object.entries(props.pets).map(([key,pet]) =>
                <div className="pet-for-owner my-4 shadow p-3" key={key}>
                    <Pet
                        key={key}
                        name={pet.name}
                        breed={pet.breed}
                        gender={pet.gender}
                        age={pet.age}
                        vaccinated={pet.vaccinated}
                        description={pet.description}
                        image={pet.image}
                    />
                    <div className="pet-buttons">
                        <NavLink className="internal-link" to={params.owner_id+'/pets/'+pet._id}>
                            <button type="button" className="btn btn-info ml-2">
                                <FontAwesomeIcon className="icon-svg" icon={faPen} size="1x"/>
                            </button>
                        </NavLink>
                        <button type="button" className="btn btn-danger ml-2" id={pet._id} onClick={handleShow}>
                            <FontAwesomeIcon className="icon-svg" icon={faTrash} size="1x"/>
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
};

export default PetsListPerOwner;