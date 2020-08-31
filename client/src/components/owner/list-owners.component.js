import React, {useEffect, useState} from 'react';
import Owner from './owner.component.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const OwnersList = () => {

    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState([]);

    // Run only once when the component loads
    useEffect(() => {
        getOwners();
    }, []);

    const getOwners = async () => {
        const response = await fetch('http://pethut.com/owners');
        const owners = await response.json();
        setOwners(owners);
    };

    const deleteOwner = (e) => {
        axios.delete('http://pethut.com/owners/' + selectedOwner.id)
            .then((res) => {
                console.log(res);
                handleClose();
                // Update Owners List
                getOwners();
                // Show success msg
                handleSuccess();
            })
            .catch(err => console.log(err.response.data));
    };

    // Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setSelectedOwner(e.target);
    }

    // Success on Deletion
    const [deleteSuccess, setDeleteSuccess ] = useState(false);
    const handleSuccess = () => setDeleteSuccess(!deleteSuccess);

    return(
        <div className="content-div owners-list-container">
            <div>
                {deleteSuccess && (
                    <div className="success-msg mb-3" >
                        <p className="m-0 p-0">Owner Deleted Successfully!</p>
                    </div>
                )}
                <div className="ml-1"><h2>Pet Owners</h2></div>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Delete Owner Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to delete this owner and his pets?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={deleteOwner}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {owners.map((owner,index)=>(
                <div className="owner-detail-row" key={index}>
                    <Owner
                        key={index}
                        firstName={owner.firstName}
                        lastName={owner.lastName}
                        address={owner.address}
                        phone={owner.phone}
                        email={owner.email}
                        id={owner._id}
                    />
                    <div className="owner-buttons">
                        <NavLink className="internal-link" to={'/owners/'+owner._id}>
                            <button type="submit" className="btn btn-info ml-2">
                                <FontAwesomeIcon className="icon-svg" icon={faPen} size="1x"/>
                            </button>
                        </NavLink>
                        <button type="button" className="btn btn-danger ml-2" id={owner._id} onClick={handleShow}>
                            <FontAwesomeIcon className="icon-svg" icon={faTrash} size="1x"/>
                        </button>
                    </div>
                </div>
            ))}

            <div className="mt-4">
                 <NavLink className="internal-link" to="/owners/new">
                    <button type="button" className="btn btn-info ml-2">
                        <FontAwesomeIcon className="icon-svg mr-2" icon={faPlus} size="1x"/>
                        Add Owner
                    </button>
                 </NavLink>
            </div>
        </div>
    )
};

export default OwnersList;