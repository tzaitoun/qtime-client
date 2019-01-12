import React from 'react';
import { BrowserRouter as Router , Route } from 'react-router-dom';

import app from '../firebase/app';
import AuthContext from '../firebase/AuthContext';

import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

/* The root element component of the app, which saves auth state of the user and routes to other pages */
class App extends React.Component {
    
    constructor(props) {
        super(props);

        // auth: if the user is authenticated, authUser: the authenticated user, loaded: if the auth state was resolved
        this.state = {
            auth: false,
            authUser: null,
            loaded: false
        };
    }

    componentWillMount() {
        this.listener = app.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState(() => ({
                    auth: true,
                    authUser: user,
                    loaded: true
                }));
            } else {
                this.setState(() => ({
                    auth: false,
                    authUser: null,
                    loaded: true
                }));
            }
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const { auth, authUser, loaded } = this.state;

        // If the auth state is not resolved
        if (!loaded) {
            return <div></div>;
        }

        // If the auth state is resolved, pass the authenticated user to all components
        return (
            <AuthContext.Provider value={authUser}>
                <Router>
                    <div>
                        <PrivateRoute auth={auth} exact path="/" component={Home} />
                        <PublicRoute auth={auth} exact path="/signin" component={SignIn} />
                        <PublicRoute auth={auth} exact path="/signup" component={SignUp} />
                    </div>
                </Router>
            </AuthContext.Provider>
        );
    }
}

export default App;