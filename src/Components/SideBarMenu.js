import React from 'react';
import './SideBarMenu.css';
import { Link } from 'react-router-dom';


export const SideBarMenu = ({ show }) => {
    return (
  
        <div className={show ? 'SideBarContainer active' : 'SideBarContainer'}>
      
            <ul>
                <li>
                    <Link to="/home">Dashboard</Link>
                </li>
                <li>
                    <Link to="/bible">Bible</Link>
                </li>
                <li>
                    <Link to="/notes">Notes</Link>
                </li>
            </ul>

        </div>
    );
};

export default SideBarMenu;