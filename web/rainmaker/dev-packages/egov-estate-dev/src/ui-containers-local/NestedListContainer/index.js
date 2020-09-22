import React, { Component } from "react";
import {NestedList} from '../../ui-molecules-local'

export default class NestedListContainer extends Component {
    render() {
        return (
            <NestedList {...this.props}/>
        )
    }
}