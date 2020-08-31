import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faHeart } from '@fortawesome/free-solid-svg-icons'
import PetAdopt from '../adoption/pet-adoption.component';

const PetDetail = () => {

    let params = useParams();
    const [petDetail, setPetDetail] = useState([]);
    const [ownerDetail, setOwnerDetail] = useState([]);
    const [adoptionForm, setAdoptionForm] = useState(false);

    // Run only once when the component loads
    useEffect(() => {
        getPetDetail();
    }, []);


    const getPetDetail = async () => {
        let response = await fetch('http://pethut.com/pets/' + params.pet_id);
        const petDetail = await response.json();
        setPetDetail(petDetail);

        // Get Owner Detail from Query Service
        response = await fetch('http://pethut.com/query/pets/' + params.pet_id);
        const ownerDetail = await response.json();
        setOwnerDetail(ownerDetail);
    };

    const showAdoptionForm = () => {
        setAdoptionForm(true);
    };

    return(
        <div className="content-div pet-detail-container m-0 my-4 row">
            <div className="col-sm-12 my-3"><h2>Pet Details</h2></div>
            <div className="col-sm-5">
                <img className='rounded' src={'http://pethut.com/' + petDetail.image} width='100%' alt="Pet"/>
            </div>
            <div className="col-sm-7 pet-detail-content rounded shadow">
                <h1>{petDetail.name}</h1>
                <FontAwesomeIcon icon={faPaw} size="lg"/>
                <p className="pet-feature-breed">{petDetail.breed}</p>
                <ul className="list-unstyled pet-features-list">
                    <li className="pet-feature"><p>Sex</p>{petDetail.gender}</li>
                    <li className="pet-feature"><p>Age</p>{petDetail.age}</li>
                    <li className="pet-feature"><p>Vaccinated</p>{petDetail.vaccinated ? 'Yes' : 'No'}</li>
                </ul>
                <div className="pet-owner-detail pt-4">
                    <h1 className="pet-owner-name">{ownerDetail.firstName} {ownerDetail.lastName}</h1>
                    <h3 className="pet-owner-tag">Owner</h3>
                    <p className="mt-2 pet-about">{petDetail.description}</p>
                </div>
                <div className="mt-4">
                    <button type="submit" className="btn btn-info ml-2" onClick={showAdoptionForm}>
                        <FontAwesomeIcon icon={faHeart} size="lg" className="mr-2"/>
                         Adopt
                    </button>
                </div>
            </div>
            { adoptionForm && (
                <div className="col-sm-12">
                    <PetAdopt petDetail={petDetail} ownerDetail={ownerDetail}/>
                </div>
            )}

        </div>
    )
};

export default PetDetail;