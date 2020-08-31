import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";

const AdoptionDetail = () => {

    let params = useParams();
    const [adoptionDetail, setAdoptionDetail] = useState([]);
    const [petDetail, setPetDetail] = useState([]);
    const [ownerDetail, setOwnerDetail] = useState([]);

    // Run only once when the component loads
    useEffect(() => {
        getAdoptionDetail();
    }, []);


    const getAdoptionDetail = async () => {
        let response = await fetch('http://pethut.com/adoptions/' + params.adoption_id);
        const adoptionDetail = await response.json();
        setAdoptionDetail(adoptionDetail);
        setPetDetail(adoptionDetail.pet);
        setOwnerDetail(adoptionDetail.owner);
    };

    const formatDate = (dateStr) => {
        var options = { dateStyle: 'medium', timeStyle: 'medium' };
        return new Date(dateStr).toLocaleString([],options);
    }

    return(
        <div className="content-div">
            <div className="mb-3">
                <p>Your adoption is successfully complete!</p>
                <h2>Adoption Detail</h2>
            </div>
            <div className="content-div adoption-detail row pb-3">
                <div className="col-sm-3">
                    <h4>Date</h4>
                    <div className='content p-2'>
                        <p>{ formatDate(adoptionDetail.date) }</p>
                    </div>
                </div>
                <div className="col-sm-3 clearfix">
                    <h4>Pet Details</h4>
                    <div className='content p-2'>
                        <img className='rounded' src={'http://pethut.com/uploads/' + petDetail.image} width='40%' alt="Pet"/>
                        <p className='font-weight-bold'>{ petDetail.name }</p>
                        <p>{ petDetail.breed }</p>
                        <p>{ petDetail.gender }</p>
                        <p>{ petDetail.age }</p>
                        <p>{ petDetail.vaccinated ? 'Vaccinated' : 'Not Vaccinated' }</p>
                    </div>
                </div>
                <div className="col-sm-3">
                    <h4>Pet Owner Details</h4>
                    <div className='content p-2'>
                        <p className='font-weight-bold'>{ ownerDetail.firstName } { ownerDetail.lastName }</p>
                        <p>{ ownerDetail.address }</p>
                        <p>{ ownerDetail.phone }</p>
                        <p>{ ownerDetail.email }</p>
                    </div>
                </div>
                <div className="col-sm-3">
                    <h4>Adopter Details</h4>
                    <div className='content p-2'>
                        <p className='font-weight-bold'>{ adoptionDetail.firstName } { adoptionDetail.lastName }</p>
                        <p>{ adoptionDetail.address }</p>
                        <p>{ adoptionDetail.email }</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AdoptionDetail;