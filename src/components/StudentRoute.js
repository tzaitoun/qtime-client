import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/* A route that can only be accessed by an authenticated student */
function StudentRoute({ component: Component, auth, ...rest }) {
    return (
        <Route {...rest} render={(props) => {
            if (auth.authRole === 0) {
                return (<Component {...props} />);
            } else if (auth.authRole === 1) {
                return (<Redirect to='/i/home' />);
            } else {
                return (<Redirect to={{pathname: '/signin', state: { from: props.location } }} />);
            }
        }} />
    );
}

export default StudentRoute;