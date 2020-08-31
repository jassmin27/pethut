import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './components/home-page.component.js';
import Page404 from './components/page-404.component.js';
import Navbar from './components/navbar.component.js';

import OwnersList from './components/owner/list-owners.component';
import AddOwner from './components/owner/add-owner.component';
import EditOwner from './components/owner/edit-owner.component';

import PetsList from './components/pet/list-pets.component';
import AddPet from './components/pet/add-pet.component';
import EditPet from './components/pet/edit-pet.component';
import PetDetail from './components/pet/pet-detail.component';

import AdoptionsList from './components/adoption/list-adoptions.component';
import AdoptionDetail from './components/adoption/adoption-detail.component';

function App() {

  return (
    <Router>
        <div className="container main p-4 my-5 shadow">
        <Navbar />
        <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/owners" exact component={OwnersList} />
            <Route path="/pets" exact component={PetsList} />
            <Route path="/owners/new" exact component={AddOwner} />
            <Route path="/owners/:owner_id" exact component={EditOwner} />
            <Route path="/owners/:owner_id/pets/new" exact component={AddPet} />
            <Route path="/owners/:owner_id/pets/:pet_id" exact component={EditPet} />
            <Route path="/pets/:pet_id" exact component={PetDetail} />
            <Route path="/adoptions" exact component={AdoptionsList} />
            <Route path="/adoptions/:adoption_id" exact component={AdoptionDetail} />
            <Route component={Page404} />
        </Switch>
        </div>
    </Router>
  );
}

export default App;
