import React from 'react';
import {
    Link,
  } from "react-router-dom";
import './Header.css';
import { RiUserSettingsLine } from 'react-icons/ri'
import { FaGripLinesVertical } from 'react-icons/fa'
import { HiOutlineHome } from 'react-icons/hi'
import LoginButton from './LoginButton'
import LogoutButton from '../account-management/logout/LogoutButton'
import Tooltip from '@material-ui/core/Tooltip';

{/*
  The header allows the user to go back to the dasboard, edit his profile, login and logout
  It hase one props which is the login of the user dsiplayed next to the other links
*/}
export default class Header extends React.Component {
    render() {

    const { login } = this.props;

    return (
        <div className="header">
          <text className="link">Edurell</text>
          <div style={{display: 'flex', flexDirection: 'column'}}>
              {/* if the user is on the welcome page we only see the login butto on the header */}
              {this.props.page === 'welcome'
              ? <Tooltip title="Login"><Link className="link" style={{fontSize: 20}} to="/login"><LoginButton/></Link></Tooltip>
              :
              this.props.page === 'login'
              ?  <Tooltip title=""><Link className="link" style={{fontSize: 20}} onClick={this.props.onClick} to="/login"><LoginButton/></Link></Tooltip>
              // else we have the links to the dashboard, edit profile and logout
              : <div style={{flex: 1, display: 'flex', flexDirection: 'row',  alignItems: 'center'}}>
                  <text className="link" style={{fontSize: 20}}>{login}</text>
                  <FaGripLinesVertical size={30} color="white"/>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                    <Tooltip title ="Home Page">
                      <Link to={`/dashboard`}>
                        <HiOutlineHome size={30} color="white"/>
                      </Link>
                    </Tooltip>
                    <Tooltip title ="Edit Profile">
                      <Link to={`/editProfile/${login}/`}>
                        <RiUserSettingsLine size={30} color="white"/>
                      </Link>
                    </Tooltip>
                    <LogoutButton/>
                  </div>
              </div>}
          </div>
        </div>
  );}
}
