import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/* A public route that can be accessed by un-authenticated users only. */
function PublicRoute({ component: Component, auth, ...rest }) {
    return (
        <Route {...rest} render={(props) => 
            (auth === false 
                ? <Component {...props} /> 
                : <Redirect to='/' />)
        } />
    );
}

export default PublicRoute;