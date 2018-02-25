import React, { Component } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import {NavLink} from 'react-router-dom';

export default class MenuExampleInvertedSecondary extends Component {
    constructor(props){
        super(props);
        this.state = { activeItem: '' };
    }

    handleItemClick(e){
        this.setState(() => {
            let activeItem = '';
            return {
                activeItem: activeItem
            }
        })
    }

    render() {
        let activeItem = this.state.activeItem;
        return (
            <ul className='nav'>
                <li>
                    <NavLink exact activeClassName='active' to='/'>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/popular'>
                        Popular
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/charts'>
                        Charts
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/battle2'>
                        Battle 2
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/notes'>
                        Notes
                    </NavLink>
                </li>
            </ul>
        )
    }
}