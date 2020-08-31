import React from 'react';

const Adoption = (props) => {

    return(
        <ul className="border-bottom owner-detail list-group list-group-horizontal py-2 row">
            <li className="list-group-item col-sm-2 border-0">{props.firstName} {props.lastName}</li>
            <li className="list-group-item col-sm-2 border-0">{props.address}</li>
            <li className="list-group-item col-sm-3 border-0">{props.phone}</li>
            <li className="list-group-item col-sm-3 border-0">{props.email}</li>
        </ul>
    );
}

export default Adoption;