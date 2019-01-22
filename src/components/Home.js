import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import HomeNavBar from '../components/HomeNavBar';
import AuthContext from '../firebase/AuthContext';

class Home extends React.Component {

    render() {

        if (this.context.authRole === 0) {
			return (<Redirect to='/s/home' />);
		} else if (this.context.authRole === 1) {
			return (<Redirect to='/i/home' />);
		}

        return (
            <div>
                <HomeNavBar />
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired
};
  
Home.contextType = AuthContext;

export default Home;