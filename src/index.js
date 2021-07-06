import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './carmakes.json'

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import { Form } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';


function compare(a, b) {
    const nameA = a.Make_Name;
    const nameB = b.Make_Name;
    let comparison = 0;
    if (nameA > nameB) {
        comparison = 1;
    } else if (nameA < nameB) {
        comparison = -1;
    }
    return comparison;
}

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            costpermile: NaN,
            iPaid: "",
            miles: "",
            mait: "",
            api: require('./carmakes.json')["Results"].sort(compare),
            models: [],
            originalPrice: "",
            finalPrice: "",
            tolls: "",
            statecode: "",
            mpg: "",
            subscriptions: "",
            gallon: "",
            typeOfGas: "gasoline",
            priceOfGas: "",
            city: "",
            VIN: "",
            VINAPI: "",
            depreciationValue: "",
            fullcharge: "",
            fullchargeCost: "",
            zipcode: "",
            carMake: "-",
            carModel: "",
            isElectric: "",
            carYear: "",
            carBasePrice: "",
            seeOtherCPM: "",
            otherFamousCars: require('./famouscars.json')["Results"].sort(compare),

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);


    }

    depreciate() {

        let depreciation = (parseInt(this.state.originalPrice) - parseInt(this.state.finalPrice)) / (2021 - parseInt(this.state.carYear));
        this.setState({ depreciationValue: depreciation });
    }
    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        });

        console.log(this.state);
    }
    handleClick(e) {
        this.getVIN(this.state.VIN);

    }

    handleSubmit(e) {
        e.preventDefault();
        this.depreciate();
        this.getZIP(this.state.zipcode);

        if (this.state.mpg.length > 0) {
            this.getData(this.state.statecode);
        }



    }
    getVIN(vin) {
        var make;
        var model;
        var modelYear;
        var basePrice;
        var fuelType;
        if (vin.length > 0) {
            fetch('https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/' + this.state.VIN + '?format=json&modelyear=')
                .then(response => response.json())
                .then(data => {
                    this.setState({ VINAPI: data["Results"] });

                    if (this.state.VINAPI.length > 0) {
                        make = this.state.VINAPI.filter((x) => x.Variable === "Make")[0].Value;
                        model = this.state.VINAPI.filter((x) => x.Variable === "Model")[0].Value;
                        modelYear = this.state.VINAPI.filter((x) => x.Variable === "Model Year")[0].Value;
                        basePrice = this.state.VINAPI.filter((x) => x.Variable === "Base Price ($)")[0].Value;
                        fuelType = this.state.VINAPI.filter((x) => x.Variable === "Fuel Type - Primary")[0].Value;
                        if (make === null || make === "Not Applicable") {
                            console.log("make is null");
                        }
                        if (model === null || make === "Not Applicable") {
                            console.log("model is null");
                        }
                        if (modelYear === null || make === "Not Applicable") {
                            console.log("modelYear is null");
                        }
                        if (basePrice === null || make === "Not Applicable") {
                            console.log("basePrice is null");
                        }
                        if (fuelType === null || make === "Not Applicable") {
                            console.log("fuelType is null");
                        }
                        if (fuelType !== null) {
                            if (fuelType.indexOf("as") > 0) {
                                fuelType = "gas"
                            } else {
                                fuelType = "electric"
                            }
                        } else {
                            fuelType = ""
                        }
                        this.setState({
                            carMake: make,
                            carModel: model,
                            carYear: modelYear,
                            carBasePrice: basePrice,
                            isElectric: fuelType
                        })
                        console.log(this.state);
                    }

                })

        }
    }

    getZIP(zip) {
        if (zip.length > 0) {
            const options = {
                "method": "GET",
                "hostname": "redline-redline-zipcode.p.rapidapi.com",
                "port": null,
                "path": "/rest/info.json/" + this.state.zipcode + "/degrees",
                "headers": {
                    "x-rapidapi-key": "73d45d6313mshd16f17ab16d3fe8p1368ecjsn7f132604eddb",
                    "x-rapidapi-host": "redline-redline-zipcode.p.rapidapi.com",
                    "useQueryString": true
                }
            };
            /*var obj = {  
                method: 'GET',
                
                "port": null,
                "path": "/rest/info.json/" + this.state.zipcode + "/degrees",
                headers: {
                    "x-rapidapi-key": "73d45d6313mshd16f17ab16d3fe8p1368ecjsn7f132604eddb",
                    "x-rapidapi-host": "redline-redline-zipcode.p.rapidapi.com",
                    "useQueryString": true
                },
                
            };
            fetch('redline-redline-zipcode.p.rapidapi.com/rest/info.json/ ${this.state.zipcode}  /degrees')
            .then(response => response.json())
            .then(data => {
                console.log(data.toString());
                
                this.setState({
                    statecode: data.state,
                    city: data.city,
                })
                this.getData(this.state.statecode);
            })
            */





            const http = require("https");


            var self = this;
            const req = http.request(options, function (res) {
                const chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    const body = Buffer.concat(chunks);

                    var bodyJSON = JSON.parse(body.toString());
                    console.log(bodyJSON);
                    self.setState({
                        statecode: bodyJSON.state,
                        city: bodyJSON.city,
                    })

                    self.getData(self.state.statecode)

                });
            })

            req.end();



        }
    }


    getData(state) {

        if (state.length > 0) {

            /*
            const options = {
                "method": "GET",
                
                "port": null,
                "path": "/gasPrice/stateUsaPrice?state=" + state.toUpperCase(),
                "headers": {
                    "content-type": "application/json",
                    "authorization": "apikey 49S3NpApsO1VH7MBkPuIdl:7czVHVdiBbrpo2bR2gV987"
                }
            }
            fetch("api.collectapi.com",options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.getData(this.state.statecode)
            })
            */


            var http = require("https");

            var options = {
                "method": "GET",
                "hostname": "api.collectapi.com",
                "port": null,
                "path": "/gasPrice/stateUsaPrice?state=" + state.toUpperCase(),
                "headers": {
                    "content-type": "application/json",
                    "authorization": "apikey 49S3NpApsO1VH7MBkPuIdl:7czVHVdiBbrpo2bR2gV987"
                }
            };
            var self = this;
            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    var bodyJSON = JSON.parse(body.toString());
                    console.log(bodyJSON);
                    console.log(self.state.typeOfGas);
                    var city = bodyJSON.result.cities.filter((x) => x.name.toLowerCase() === self.state.city.toLowerCase());
                    if (city.length > 0) {
                        console.log(city[0][self.state.typeOfGas]);
                        self.setState({
                            gallon: city[0][self.state.typeOfGas]
                        })
                        console.log(self.state);
                    }

                    let final;

                    if (self.state.mpg.length > 0) {
                        final = (parseInt(self.state.depreciationValue) +
                            parseInt(self.state.iPaid) +
                            (((self.state.miles * 52) / self.state.mpg) * self.state.gallon) +
                            parseInt(self.state.mait) +
                            (parseInt(self.state.tolls) * 12) +
                            parseInt(self.state.subscriptions))
                            / (parseInt(self.state.miles) * 52);
                    } else {
                        final = (parseInt(self.state.depreciationValue) +
                            parseInt(self.state.iPaid) +
                            ((parseInt(self.state.miles) / parseInt(self.state.fullcharge)) * parseInt(self.state.fullchargeCost)) +
                            parseInt(self.state.mait) +
                            (parseInt(self.state.tolls) * 12) +
                            parseInt(self.state.subscriptions)) /
                            (parseInt(self.state.miles) * 52);

                    }

                    self.setState(
                        {
                            costpermile: final
                        });



                });
            });

            req.end();


        }
    }

    renderListElement(stringDisplay, CPM, displayImage) {
        var awesome = "";
        if (typeof displayImage !== "undefined") {
            return (
                <tr>
                    <td>{stringDisplay}</td>
                    <td>{CPM}</td>
                    <td>{this.state.costpermile.toFixed(2) - CPM > 0 ? "+" + (this.state.costpermile.toFixed(2) - CPM).toFixed(2) : (this.state.costpermile.toFixed(2) - CPM).toFixed(2)}</td>
                    <td><Image src={displayImage} fluid /></td>
                </tr>
            );
        }
        else {
            return (
                <tr>
                    <td>{stringDisplay}</td>
                    <td>{CPM}</td>
                    <td>{this.state.costpermile.toFixed(2) - CPM > 0 ? "+" + (this.state.costpermile.toFixed(2) - CPM).toFixed(2) : (this.state.costpermile.toFixed(2) - CPM).toFixed(2)}</td>
                </tr>
            )
        }
    }
    componentDidMount() {


    }
    render() {

        let allOptions;


        allOptions = this.state.api.map((num) => <option>{num.Make_Name}</option>)
        let allOptions2;
        let renderCarModel;

        if (this.state.carMake.length > 0) {
            fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/' + this.state.carMake + '?format=json')
                .then(response => response.json())
                .then(data => {
                    this.setState({ models: data["Results"] });

                })

        }

        var years = [];
        for (var i = 0; i < 100; i++) {
            years.push(2021 - i);
        }
        const carYears = years.map((num) => <option>{num}</option>)
        allOptions2 = this.state.models.map((num) => <option>{num.Model_Name}</option>)

        //CONDITIONAL RENDERING FOR CAR MODEL BASED ON MAKE
        if (this.state.carMake.indexOf("-") === 0) {
            renderCarModel = (<div></div>);
        }
        else {
            renderCarModel = (
                <div>
                    <Form.Group>
                        <Form.Label>
                            7a. What is your car model?
                        </Form.Label>
                        <Form.Control
                            as="select"

                            onChange={this.handleChange}
                            id="carModel"
                            name="carModel"
                            value={this.state.carModel}
                        >
                            {allOptions2}
                        </Form.Control>
                    </Form.Group>
                </div>
            );

        }

        let renderThis;
        // CONDITIONAL RENDERING BASED ON USER CHOICE IF ELECTRIC OR NOT
        if (this.state.isElectric.indexOf("as") > 0) {
            renderThis = (<div><Form.Group>
                <Form.Label>
                    9a. What fuel type do you use?
                </Form.Label>
                <Form.Control as="select"
                    onChange={this.handleChange}
                    id="typeOfGas"
                    type="text"
                    name="typeOfGas"
                    value={this.state.typeOfGas}
                >
                    <option name="typeOfGas"> gasoline</option>
                    <option name="typeOfGas">midGrade</option>
                    <option name="typeOfGas"> premium</option>
                    <option name="typeOfGas"> diesel</option>
                </Form.Control>
                <Form.Text>
                    Do not answer this question if you are an electric vehicle user
                </Form.Text>
            </Form.Group>


                <Form.Group>
                    <Form.Label>
                        9b. What is your MPG(Miles Per Gallon)?
                    </Form.Label>

                    <Form.Control
                        placeholder="Enter your mpg"
                        onChange={this.handleChange}
                        id="mpg"
                        type="number"
                        name="mpg"
                        value={this.state.mpg}
                    />
                    <Form.Text>
                        Do not answer this question if you are an electric vehicle user
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        9c. What is your zip code?
                    </Form.Label>

                    <Form.Control
                        placeholder="Enter your zip code"
                        onChange={this.handleChange}
                        id="zipcode"
                        type="number"
                        name="zipcode"
                        value={this.state.zipcode}
                    />
                    <Form.Text >
                        This question gets the gas prices in your area!
                    </Form.Text>
                </Form.Group>


                <label>
                    {this.state.city.length > 0 ? "Your city, state is " + this.state.city + ", " + this.state.statecode : ""}
                </label>
            </div>);
        } else if (this.state.isElectric.indexOf("lectric") > 0) {
            renderThis = (<div>
                <Form.Group>
                    <Form.Label>
                        9a. If you drive an electric vehicle, how far can you drive on a full charge in miles?
                    </Form.Label>

                    <Form.Control
                        placeholder="fullcharge"
                        onChange={this.handleChange}
                        id="fullcharge"
                        type="number"
                        name="fullcharge"
                        value={this.state.fullcharge}
                    />
                    <Form.Text>
                        Do not answer this question if you are a gas vehicle user
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        9b. If you drive an electric vehicle, how much does it cost for a full charge?
                    </Form.Label>

                    <Form.Control
                        placeholder="fullchargeCost"
                        onChange={this.handleChange}
                        id="fullchargeCost"
                        type="number"
                        name="fullchargeCost"
                        value={this.state.fullchargeCost}
                    />
                    <Form.Text>
                        Do not answer this question if you are a gas vehicle user
                    </Form.Text>
                </Form.Group>
            </div>);
        } else {
            renderThis = (
                <div></div>
            );
        }

        let otherCPM;
        //CONDITIONAL RENDERING FOR DATA SHOWN AT THE BOTTOM
        if (this.state.seeOtherCPM.indexOf("10k") > 0) {
            otherCPM = (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Cost per mile of</th>
                            <th>Cost per mile ($)</th>
                            <th>Cost per mile in relation to You</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Your Cost Per Mile</td>
                            <td>{this.state.costpermile.toFixed(2)}</td>
                            <td>{(this.state.costpermile - this.state.costpermile).toFixed(2)}</td>
                        </tr>

                        {this.renderListElement("Average US Driver who drives 10k miles", 79)}

                        {this.renderListElement("Average US Driver who drives a Small Sedan (10k miles)", 0.61)}
                        {this.renderListElement("Average US Driver who drives a Medium Sedan (10k miles)", 0.75)}
                        {this.renderListElement("Average US Driver who drives a Large Sedan (10k miles)", 0.90)}
                        {this.renderListElement("Average US Driver who drives a Small SUV (10k miles)", 0.71)}
                        {this.renderListElement("Average US Driver who drives a Medium SUV (10k miles)", 0.87)}
                        {this.renderListElement("Average US Driver who drives a Minivan (10k miles)", 0.87)}
                        {this.renderListElement("Average US Driver who drives a Hybrid Vehicle (10k miles)", 0.68)}
                        {this.renderListElement("Average US Driver who drives an Electric Vehicle (10k miles", 0.75)}
                    </tbody>
                </Table>
            )

        }
        else if (this.state.seeOtherCPM.indexOf("15k") > 0) {
            otherCPM = (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Cost per mile of</th>
                            <th>Cost per mile ($)</th>
                            <th>Cost per mile in relation to You</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Your Cost Per Mile</td>
                            <td>{this.state.costpermile.toFixed(2)}</td>
                            <td>{(this.state.costpermile - this.state.costpermile).toFixed(2)}</td>
                        </tr>

                        {this.renderListElement("Average US Driver who drives 15k miles", 0.61)}

                        {this.renderListElement("Average US Driver who drives a Small Sedan (15k miles)", 0.47)}
                        {this.renderListElement("Average US Driver who drives a Medium Sedan (15k miles)", 0.58)}
                        {this.renderListElement("Average US Driver who drives a Large Sedan (15k miles)", 0.69)}
                        {this.renderListElement("Average US Driver who drives a Small SUV (15k miles)", 0.56)}
                        {this.renderListElement("Average US Driver who drives a Medium SUV (15k miles)", 0.68)}
                        {this.renderListElement("Average US Driver who drives a Minivan (15k miles)", 0.67)}
                        {this.renderListElement("Average US Driver who drives a Hybrid Vehicle (15k miles)", 0.52)}
                        {this.renderListElement("Average US Driver who drives an Electric Vehicle (15k miles", 0.55)}



                    </tbody>
                </Table>


            )
        }
        else if (this.state.seeOtherCPM.indexOf("20k") > 0) {
            otherCPM = (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Cost per mile of</th>
                            <th>Cost per mile ($)</th>
                            <th>Cost per mile in relation to You</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Your Cost Per Mile</td>
                            <td>{this.state.costpermile.toFixed(2)}</td>
                            <td>{(this.state.costpermile - this.state.costpermile).toFixed(2)}</td>
                        </tr>


                        {this.renderListElement("Average US Driver who drives 20k miles", 0.53)}
                        {this.renderListElement("Average US Driver who drives a Small Sedan (20k miles)", 0.41)}
                        {this.renderListElement("Average US Driver who drives a Medium Sedan (20k miles)", 0.49)}
                        {this.renderListElement("Average US Driver who drives a Large Sedan (20k miles)", 0.59)}
                        {this.renderListElement("Average US Driver who drives a Small SUV (20k miles)", 0.48)}
                        {this.renderListElement("Average US Driver who drives a Medium SUV (20k miles)", 0.59)}
                        {this.renderListElement("Average US Driver who drives a Minivan (20k miles)", 0.57)}
                        {this.renderListElement("Average US Driver who drives a Hybrid Vehicle (20k miles)", 0.43)}
                        {this.renderListElement("Average US Driver who drives an Electric Vehicle (20k miles", 0.46)}
                    </tbody>
                </Table>


            )
        }
        else if (this.state.seeOtherCPM.indexOf("Other") > 0) {
            var renderTable = this.state.otherFamousCars.map((N) => this.renderListElement("Average US Driver who drives a " + N.Name, N.CPM, N.Image))
            otherCPM = (
                <Table striped bordered hover>

                    <thead>
                        <tr>
                            <th>Cost per mile of</th>
                            <th>Cost per mile ($)</th>
                            <th>Cost per mile in relation to You</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Your Cost Per Mile</td>
                            <td>{this.state.costpermile.toFixed(2)}</td>
                            <td>{(this.state.costpermile - this.state.costpermile).toFixed(2)}</td>
                        </tr>
                        {renderTable}


                    </tbody>
                </Table>);
            //allOptions = this.state.api.map((num) => <option>{num.Make_Name}</option>)

            {/*{this.renderListElement("Average US Driver who drives an Acura RDX", 0.74)}
                    {this.renderListElement("Average US Driver who drives an Audi Q5", 0.89)}
                    {this.renderListElement("Average US Driver who drives a BMW i3 series", 0.60)}
                    {this.renderListElement("Average US Driver who drives a Buick Enclave" , 0.76)}
                    {this.renderListElement("Average US Driver who drives a Cadillac Escalade" , 1.35)}
                    {this.renderListElement("Average US Driver who drives a Chevrolet Equinox" , 0.61)}
                    {this.renderListElement("Average US Driver who drives a Dodge Charger" , 0.60)}
                    {this.renderListElement("Average US Driver who drives a Ford F-150" , 0.67)}
                    {this.renderListElement("Average US Driver who drives a Honda CR-V" , 0.45)}
                    {this.renderListElement("Average US Driver who drives a Hyundai Santa Fe" , 0.57)}
                    {this.renderListElement("Average US Driver who drives an Infiniti q50" , 0.80)}
                    {this.renderListElement("Average US Driver who drives a Jeep Wrangler" , 0.66)}
                    {this.renderListElement("Average US Driver who drives a Kia Sportage" , 0.48)}
                    {this.renderListElement("Average US Driver who drives a Lexus RX350 ", 0.81 )}
                    {this.renderListElement("Average US Driver who drives a Mercedes C Class",0.80 )}
                    {this.renderListElement("Average US Driver who drives a Nissan Rogue", 0.50 )}
                    {this.renderListElement("Average US Driver who drives a Porsche Macan",1.07 )}
                    {this.renderListElement("Average US Driver who drives a Subaru Outback", 0.50 )}
                    {this.renderListElement("Average US Driver who drives a Tesla Model X", 1.27 )}
                    */}


        }
        else {
            otherCPM = (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Cost per mile of</th>
                            <th>Cost per mile ($)</th>
                            <th>Cost per mile in relation to You</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Your Cost Per Mile</td>
                            <td>{this.state.costpermile.toFixed(2)}</td>
                            <td>{(this.state.costpermile - this.state.costpermile).toFixed(2)}</td>
                        </tr>

                        {this.renderListElement("Average US Driver who drives 10k miles", 0.79)}
                        {this.renderListElement("Average US Driver who drives 15k miles", 0.61)}
                        {this.renderListElement("Average US Driver who drives 20k miles", 0.53)}
                    </tbody>
                </Table>
            )
        }
        //STORING THE LAST QUESTION

        var lastQuestion;
        if (Number.isNaN(this.state.costpermile)) {
            lastQuestion = (<Form.Group>
                <Form.Label>
                    11. How much is your car worth now?
                </Form.Label>
                <Form.Control
                    placeholder="Enter the current price"
                    onChange={this.handleChange}
                    id="finalPrice"
                    type="number"
                    name="finalPrice"
                    value={this.state.finalPrice}
                />
                <Form.Text className="text-muted">
                    Enter your car's current worth
                </Form.Text>
            </Form.Group>);
        } else {
            lastQuestion = (<Form.Group>
                <Form.Label>
                    11. How much is your car worth now?
                </Form.Label>
                <Form.Control
                    placeholder="Enter the current price"
                    onChange={this.handleChange}
                    id="finalPrice"
                    type="number"
                    name="finalPrice"
                    value={this.state.finalPrice}
                />
                <Form.Text className="text-muted">
                    Enter your car's current worth
                </Form.Text>
                <label>Scroll Down for results</label>
                <br />
                <Image src="https://i.pinimg.com/564x/5e/8f/37/5e8f3769652154c09064e81af4ea0f8a.jpg" fluid />
            </Form.Group>);
        }
        //CONDITIONAL RENDERING FOR RELATIONAL DATA
        var renderRelationalData;
        if (Number.isNaN(this.state.costpermile)) {
            renderRelationalData = <div></div>
        }
        else {
            renderRelationalData =
                (
                    <Form.Group>
                        <h2>See Your CPM in relation to other CPM</h2>
                        <p>If you choose to see "Average CPM for other cars", the cost per mile is calculated assuming that you drive 15k miles per year, ~2000 for insurance, ~1300 for fuel, ~1300 for maitenance/repairs, and ~1300 for other miscellaneous costs</p>
                        <Form.Label>
                            Enter what information you would like to see
                        </Form.Label>
                        <Form.Control as="select"
                            onChange={this.handleChange}
                            id="seeOtherCPM"
                            type="text"
                            name="seeOtherCPM"
                            value={this.state.seeOtherCPM}
                        >
                            <option name="seeOtherCPM">-Choose one of the below-</option>
                            <option name="seeOtherCPM">CPM of Average Car Types for 10k miles per year (192 miles a week)</option>
                            <option name="seeOtherCPM">CPM of Average Car Types for 15k miles per year (288 miles a week)</option>
                            <option name="seeOtherCPM">CPM of Average Car Types for 20k miles per year (384 miles a week)</option>
                            <option name="seeOtherCPM">Average CPM For Other Cars (15000 miles a year or 288 miles a week)</option>
                        </Form.Control>
                        {otherCPM}
                    </Form.Group>
                );
        }
        return (
            <Container>

                <Jumbotron>
                    <h1>
                        11 Question Cost Per Mile Calculator

                    </h1>
                    <p>
                        Fill out these questions to the best of your abilitiy as they are the basis of calculating your cost per mile. You will be asked about information that you may not know about some of these questions so fill them out to the best of your ability.
                    </p>
                </Jumbotron>



                <Form onSubmit={this.handleSubmit}>



                    <Jumbotron>
                        <h2>Fixed Costs (Section 1/3)</h2>
                        <Form.Group>

                            <Form.Label>
                                1. How much have you paid for insurance a year?
                            </Form.Label>


                            <Form.Control
                                placeholder="Enter the amount of insurance paid a year"
                                onChange={this.handleChange}
                                id="insurance"
                                type="number"
                                name="iPaid"
                                value={this.state.iPaid}
                            />
                            <Form.Text className="text-muted">
                                Enter how much insurace you pay each year
                            </Form.Text>
                        </Form.Group>



                        <Form.Group>

                            <Form.Label>
                                2. How much have you paid for maitenance and repairs a year?
                            </Form.Label>


                            <Form.Control
                                placeholder="Enter how much you pay for maitenance a year"
                                onChange={this.handleChange}
                                id="maitenance"
                                type="number"
                                name="mait"
                                value={this.state.mait}
                            />
                            <Form.Text className="text-muted">
                                Enter how much you usually pay for maitenance in a year
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                3. How much do you pay for other related car costs a year? (subscriptions, parking, etc.)
                            </Form.Label>
                            <Form.Control
                                placeholder="Enter your other car related costs throughout the year"
                                onChange={this.handleChange}
                                id="subscriptions"
                                type="number"
                                name="subscriptions"
                                value={this.state.subscriptions}
                            />
                        </Form.Group>
                        <Form.Text className="text-muted">
                            Enter how much you pay for other related car costs a year.
                        </Form.Text>
                    </Jumbotron>


                    <Jumbotron>
                        <h2>Variable Costs (Section 2/3)</h2>
                        <Form.Group>
                            <Form.Label>
                                4. How much do you pay for tolls every month?
                            </Form.Label>


                            <Form.Control
                                placeholder="Enter how much you pay for tolls"
                                onChange={this.handleChange}
                                id="tolls"
                                type="number"
                                name="tolls"
                                value={this.state.tolls}
                            />
                            <Form.Text className="text-muted">
                                Enter how much you usually pay for tolls every month
                            </Form.Text>
                        </Form.Group>

                        <Form.Group>

                            <Form.Label>
                                5. How many miles do you usually drive per week?
                            </Form.Label>

                            <Form.Control type="number"
                                placeholder="Enter how many miles driven"
                                onChange={this.handleChange}
                                id="miles"
                                type="number"
                                name="miles"
                                value={this.state.miles}
                            />
                            <Form.Text className="text-muted">
                                Enter the miles you usually drive per week
                            </Form.Text>


                        </Form.Group>


                    </Jumbotron>

                    <Jumbotron>
                        <h2>Vehicle Specific Costs (Section 3/3)</h2>
                        <Form.Group>
                            <Form.Label>
                                6. Enter your VIN(Vehicle Identification Number) here
                            </Form.Label>
                            <Form.Control
                                placeholder="VIN (Optional) "
                                onChange={this.handleChange}
                                id="VIN"
                                type="text"
                                name="VIN"
                                value={this.state.VIN}
                            />
                            <Button
                                onClick={this.handleClick}
                            >
                                Submit your VIN to get official data from the NHTSA
                            </Button>
                            <Form.Text className="text-muted">
                                We are gathering this information in order to gather your mpg, car make, car model, and car year. If you do not know your VIN or do not want to share your VIN, enter the following questions to the best of your ability. However, if you do know your VIN, enter it and click the following button . Some data about your car may still be missing so answer the unaswered questions.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                7. What is your car make?
                            </Form.Label>
                            <Form.Control as="select"
                                placeholder="Enter your car make"
                                onChange={this.handleChange}
                                id="carMake"
                                type="text"
                                name="carMake"
                                value={this.state.carMake}
                            >
                                <option>-Choose your car make below-</option>
                                {allOptions}

                            </Form.Control>

                            <div>
                                {renderCarModel}
                            </div>
                            <Form.Text className="text-muted">
                                Enter your car make. Ex. Toyota, Honda
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                8. What is your car year?
                            </Form.Label>
                            <Form.Control
                                onChange={this.handleChange}
                                id="carYear"
                                name="carYear"
                                value={this.state.carYear}
                                as="select">
                                {carYears}
                            </Form.Control>
                            <Form.Text className="text-muted">
                                Enter the year your car was made
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>

                            <Form.Label>
                                9. Are you an electric vehicle user or gas car user?
                            </Form.Label>


                            <Form.Control as="select"

                                onChange={this.handleChange}
                                id="isElectric"
                                type="text"
                                name="isElectric"
                                value={this.state.isElectric}
                            >
                                <option name="isElectric">-Choose your power type-</option>
                                <option name="isElectric">gas</option>
                                <option name="isElectric">electric</option>

                            </Form.Control>

                            <div>
                                {renderThis}
                            </div>
                            <Form.Text className="text-muted">
                                Enter whether your car is electric or fueled by gas by clicking on the drop down.
                            </Form.Text>

                        </Form.Group>


                        <Form.Group>
                            <Form.Label>
                                10. How much was this car when it was brand new?
                            </Form.Label>
                            <Form.Control
                                placeholder="Enter your original price"
                                onChange={this.handleChange}
                                id="originalPrice"
                                type="number"
                                name="originalPrice"
                                value={this.state.originalPrice}
                            />
                            <Form.Text className="text-muted">
                                Enter how much money the car costed when it was brand new
                            </Form.Text>
                        </Form.Group>
                        <div>{lastQuestion}</div>
                        <input type="submit"
                        />

                    </Jumbotron>
                </Form>
                <br />

                {//CONDITIONAL RENDERING IF CPM IS NOT NaN
                }

                {renderRelationalData}


            </Container>
        );
    }
}

ReactDOM.render(
    <div>
        <Calculator />
        <scrollButton />
    </div>,

    document.getElementById("root")
);
