import React, {Component} from 'react';
import IndentedTree from './IndentedTree';
import {Grid} from 'semantic-ui-react';
import MyEditor from '../editor/Editor';

class Tree extends Component {

    constructor(props){
        super(props);
    }

    render() {

        return (
            <Grid divided='vertically'>
                <Grid.Row columns={2}>
                    <Grid.Column className='svgDiv'>
                        <svg width="960" height="800">
                            <IndentedTree/>
                        </svg>
                    </Grid.Column>
                    <Grid.Column>
                        <MyEditor/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

IndentedTree.propTypes = {};
IndentedTree.defaultProps = {};

export default Tree;
