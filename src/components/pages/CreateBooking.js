import React, { Component } from 'react';

class CreateBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleArr: [],
            typeArr: [],
            bodyArr: [],
            fromDate: '',
            toDate: '',
        }
    }

    handleSearchByDate = (event) => {
        event.preventDefault();
        this.requestData();
    }

    componentDidMount() {
        this.requestData();
    }

    requestData() {
        var get_params = `?from_date=${this.state.from_date}&to_date=${this.state.to_date}`;

        // api_instance.get(`room_service_booking_status${get_params}`)
        //     .then((response) => {
        //         if (response.status === 200) {
        //             this.setState({
        //                 searchData: response.data
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

        const dataTest = [
            [
                {
                    "date": "2020-06-24",
                    "Phòng hướng biển": 2,
                    "Phòng hướng vườn": 0
                },
                {
                    "date": "2020-06-25",
                    "Phòng hướng biển": 0,
                    "Phòng hướng vườn": 0
                },
                {
                    "date": "2020-06-26",
                    "Phòng hướng biển": 0,
                    "Phòng hướng vườn": 0
                },
                {
                    "date": "2020-06-27",
                    "Phòng hướng biển": 0,
                    "Phòng hướng vườn": 0
                }
            ],
            [
                "2020-06-24",
                "2020-06-25",
                "2020-06-26",
                "2020-06-27"
            ],
            [
                "Phòng hướng biển",
                "Phòng hướng vườn"
            ]
        ]

        dataTest[2] = dataTest[2].map((item) => {
            return {
                type: item,
                num: 0,
                date: ''
            };
        })

        this.setState({
            titleArr: dataTest[1],
            typeArr: dataTest[2],
            bodyArr: dataTest[0]
        });
    }

    handleChange = (event, date) => {
        let arr = this.state.typeArr;
        arr = arr.map((item) => {
            if (item.type === event.target.name) {
                item.num = event.target.value;
                item.date = date || ''
            }
            return item;
        });
        this.setState({
            typeArr: arr
        });
    }

    handleInputData = (event) => {
        alert('TVT submitData = ' + JSON.stringify(this.state.typeArr));
    }

    render() {
        return (
            <form>
                <div className="table-responsive">
                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                {this.state.titleArr.map((item, index1) => { return <th scope="col" key={index1}>{item}</th> })}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.typeArr.map((item, index2) => {
                                    return (
                                        <tr key={index2}>
                                            <th scope="row">{item.type}</th>
                                            {this.state.bodyArr.map((item1, index3) => {
                                                return (
                                                    <td key={index3}>
                                                        {item1[item.type]}
                                                        {(index3 > 0 && index3 < this.state.bodyArr.length - 1) ? <input className="form-control" name={item.type} placeholder="Số lượng phòng" onChange={(event) => this.handleChange(event, item1["date"])} /> : null}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <button className="btn btn-primary" onClick={this.handleInputData}>Hiển thị dữ liệu</button>
            </form>
        )
    }
}

export default CreateBooking;