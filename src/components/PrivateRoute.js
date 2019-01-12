import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/* A private route that will redirect an un-authenticated user to /signin and save the location of the route they were trying to access. 
 * An authenticated user will be allowed access.
 */
function PrivateRoute({ component: Component, auth, ...rest }) {
    return (
        <Route {...rest} render={(props) => 
            (auth === true 
                ? <Component {...props} /> 
                : <Redirect to={{
                    pathname: '/signin',
                    state: { from: props.location }
                }} />)
        } />
    );
}

export default PrivateRoute;