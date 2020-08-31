import React from 'react';

const Pet = (props) => {
    return(
        <div className="row pet-detail-row">
            <div className="pet-feature-container col-sm-2">
                <img src={'http://pethut.com/uploads/' + props.image} alt="Pet" width="100%" className="rounded"/>
            </div>
            <div className="pet-feature-container col-sm-2">
                <div className="pet-feature">
                    <h1>Name</h1>
                    {props.name}
                </div>
                <div className="pet-feature">
                    <h1>Breed</h1>
                    {props.breed}
                </div>
                <div className="pet-feature">
                    <h1>Gender</h1>
                    {props.gender}
                </div>
            </div>
            <div className="pet-feature-container col-sm-6">
                <div className="pet-feature">
                    <h1>Age</h1>
                    {props.age}
                </div>
                 <div className="pet-feature">
                     <h1>Vaccinated</h1>
                     {props.vaccinated ? 'Yes' : 'No'}
                 </div>
                 <div className="pet-feature">
                     <h1>Description</h1>
                     <p>{props.description}</p>
                 </div>
            </div>
        </div>
    );
}

export default Pet;
