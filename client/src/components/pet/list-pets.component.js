import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faHeart } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const PetsList = () => {

    const [pets, setPets] = useState([]);
    const [allBreeds, setAllBreeds] = useState([]);

    // Run only once when the component loads
    useEffect(() => {
        getPets();
    }, []);

    const getPets = async () => {
        const response = await fetch('http://pethut.com/pets');
        const pets = await response.json();
        setPets(pets);
        getBreeds(pets);
        console.log(pets);
    };

    const getBreeds = (pets) => {
        let breedsArray = [];
        pets.forEach((pet) => {
            breedsArray.push(pet.breed);
        })
        setAllBreeds(breedsArray);
    }

    // Filter by Breed
    const filterByBreed = (e) => {
        //console.log(e.target.id);
        setBreed(e.target.id);
    }

    const [breed, setBreed] = useState('All Breeds');

    return(
        <div className="content-div">
            <div className="ml-1"><h2>Find a Pet</h2></div>
            <div className="text-right breed-filter p-2 clearfix">
                <div><p className="mr-2">Filter:</p></div>
                <DropdownButton className="" id="dropdown-basic-button" title={breed}>
                    <Dropdown.Item className="text-right" id="All Breeds" onClick={filterByBreed}>All Breeds</Dropdown.Item>
                    {allBreeds.map((breed,index)=>(
                        <Dropdown.Item key={index} className="text-right" id={breed} onClick={filterByBreed}> {breed} </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
            <div className="row">
                {pets.map((pet,index)=>(
                    (breed === 'All Breeds' || pet.breed === breed) && (

                        <div key={index} className="pet-thumb col-sm-3 rounded my-2">
                            <NavLink className="internal-link" to={'/pets/'+pet._id}>
                                <div className="content shadow rounded p-2">
                                    <img src={'http://pethut.com/uploads/' + pet.image} alt="Pet" className="rounded"/>
                                    <div className="mx-2">
                                        <h1 className="petName mt-2">{pet.name}</h1>
                                        <FontAwesomeIcon icon={faPaw} size="lg"/>
                                        <p className="petBreed">{pet.breed}</p>
                                        <p>{pet.description}</p>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
};

export default PetsList;
