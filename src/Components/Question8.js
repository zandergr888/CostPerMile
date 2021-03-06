import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
/**
 * @author zandergr88
 * @param {object} props properties of component
 * @returns {object} Question8 component
 */
function Question8(props) {
    return (
        <Form.Group>
            <Form.Label>
                8.  Any other monthly car related costs? (e.g. parking, tolls, washing etc.)
            </Form.Label>
            <Form.Control
                placeholder="Enter how much you pay for tolls monthly"
                onChange={props._handleChange}
                id="tolls"
                type="text"
                name="tolls"
                value={props._state.tolls}
                required
            />

        </Form.Group>)
    
}
export default Question8;