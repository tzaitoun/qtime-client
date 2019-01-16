import React from 'react';
import { BrowserRouter as Router , Route } from 'react-router-dom';

import app from '../firebase/app';
import AuthContext from '../firebase/AuthContext';

import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PrivateRoute from './PrivateRoute';

/* The root element component of the app, which saves auth state of the user and routes to other pages */
class App extends React.Component {
    
    constructor(props) {
        super(props);

        // auth: the authenticated user and their role, loaded: if the auth state was resolved
        this.state = {
            auth: {
                authUser: null,
                authRole: null
            },
            loaded: false
        };

        this.handleSignUpComplete = this.handleSignUpComplete.bind(this);
    }

    handleSignUpComplete(user, role) {
        this.setState({
            auth: {
                authUser: user,
                authRole: role
            }
        });
    }

    componentWillMount() {
        this.listener = app.auth().onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult()
                    .then(result => {
                        if (result.claims.role === 0 || result.claims.role === 1) {
                            this.setState({
                                    auth: {
                                        authUser: user,
                                        authRole: result.claims.role
                                    },
                                    loaded: true
                            });
                        }
                    });
            } else {
                this.setState({
                    auth: {
                        authUser: null,
                        authRole: null
                    },
                    loaded: true
                });
            }
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const { auth, loaded } = this.state;

        // If the auth state is not resolved, this could be a loading screen
        if (!loaded) {
            return <div></div>;
        }

        // If the auth state is resolved, pass the authenticated user to all components
        return (
            <AuthContext.Provider value={auth}>
                <Router>
                    <div>
                        <PrivateRoute auth={auth} exact path="/" component={Home} />
                        <Route exact path="/signin" component={SignIn} />
                        <Route exact path='/signup' render={(props) => <SignUp {...props} handleSignUpComplete={this.handleSignUpComplete} />} />
                    </div>
                </Router>
            </AuthContext.Provider>
        );
    }
}

export default App;