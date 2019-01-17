import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import HomeNavBar from '../components/HomeNavBar';
import AuthContext from '../firebase/AuthContext';

class Home extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {

        if (this.context.authUser) {
			return (<Redirect to='/me' />);
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