import React, {useEffect, useState} from 'react';

const AdoptionsList = () => {

    const [adoptions, setAdoptions] = useState([]);

    // Run only once when the component loads
    useEffect(() => {
        getAdoptions();
    }, []);

    const getAdoptions = async () => {
        const response = await fetch('http://pethut.com/adoptions');
        const adoptions = await response.json();
        setAdoptions(adoptions);
    };

    const formatDate = (dateStr) => {
        var options = { dateStyle: 'medium', timeStyle: 'medium' };
        return new Date(dateStr).toLocaleString([],options);
    }

    return(
        <div className="content-div">
            <div className="mb-n3">
                <h2 className="page-title">Adoptions List</h2>
            </div>
            <div className="content-div adoption-detail">
                { adoptions.map((adoption,index)=>(
                    <div className="row border-bottom" key={index}>
                        <div className="col-sm-3">
                            { index===0 && (<h4>Date</h4>) }
                            <div className='content p-2'>
                                <p>{ formatDate(adoption.date) }</p>
                            </div>
                        </div>
                        <div className="col-sm-3 clearfix">
                            { index===0 && (<h4>Pet Details</h4>) }
                            <div className='content p-2'>
                                <img className='rounded' src={'http://pethut.com/uploads/' + adoption.pet.image} width='40%' alt="Pet"/>
                                <p className='font-weight-bold'>{ adoption.pet.name }</p>
                                <p>{ adoption.pet.breed }</p>
                                <p>{ adoption.pet.gender }</p>
                                <p>{ adoption.pet.age }</p>
                                <p>{ adoption.pet.vaccinated ? 'Vaccinated' : 'Not Vaccinated' }</p>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            { index===0 && (<h4>Pet Owner Details</h4>) }
                            <div className='content p-2'>
                                <p className='font-weight-bold'>{ adoption.owner.firstName } { adoption.owner.lastName }</p>
                                <p>{ adoption.owner.address }</p>
                                <p>{ adoption.owner.phone }</p>
                                <p>{ adoption.owner.email }</p>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            { index===0 && (<h4>Adopter Details</h4>) }
                            <div className='content p-2'>
                                <p className='font-weight-bold'>{ adoption.firstName } { adoption.lastName }</p>
                                <p>{ adoption.address }</p>
                                <p>{ adoption.email }</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default AdoptionsList;
