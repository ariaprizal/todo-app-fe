
import React from 'react';
import { Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    
    return (
        <div className="app">
            {/* <main> */}
                <Outlet />
            {/* </main> */}
        </div>
    );
}

export default PrivateRoute;
