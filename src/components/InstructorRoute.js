import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/* A route that can only be accessed by an authenticated instructor */
function InstructorRoute({ component: Component, auth, ...rest }) {
    return (
        <Route {...rest} render={(props) => {
            if (auth.authRole === 0) {
                return (<Redirect to='/s/home' />);
            } else if (auth.authRole === 1) {
                return (<Component {...props} />);
            } else {
                return (<Redirect to={{pathname: '/signin', state: { from: props.location } }} />);
            }
        }} />
    );
}

export default InstructorRoute;