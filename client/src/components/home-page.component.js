import React from 'react';

const HomePage = (props) => {
    return(
        <div className="home-bg">
            <img src="/images/home-bg.png" alt="Happy Dog" width="100%"/>
            <button type="button" className="btn btn-primary home-adopt-btn shadow">Adopt a pet today!</button>
        </div>
    );
}

export default HomePage;