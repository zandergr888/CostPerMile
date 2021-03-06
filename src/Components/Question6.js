import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert';
/**
 * 
 * @param {object} props properties of component
 * @returns {object} Question6 component
 */
function Question6(props) {
    return (

        <Form.Group>

            <Form.Label>
                6. How many miles do you usually drive per week?
            </Form.Label>
            <Form.Control type="text"
                placeholder="Enter how many miles driven"
                onChange={props._handleChange}
                id="miles"
                type="text"
                name="miles"
                value={props._state.miles}
                required
            />
            <Form.Text className="text-muted">Average in the US is 187 miles</Form.Text>

            {props._state.miles && !Number.isNaN(props._state.miles) ?
                (<Alert variant="secondary">
                    <Alert.Heading>Miles Per Year</Alert.Heading>
                    <p>That's {parseFloat(props._state.miles) * 52} miles a year</p>
                </Alert>)
                :
                (<div></div>)
            }
        </Form.Group>


    );
}
export default Question6;