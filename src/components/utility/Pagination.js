import React from 'react';

export default class Pagination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            limit: 10
        }
    }

    render() {
        const dataPagination = [1, 2, 3, 4, 5, 6];
        const paginationItem = {
            "width": "40px",
            "height": "40px",
            "background-color": "aquamarine"
        }
        return (
            <div className="d-flex align-items-center">
                {dataPagination.map((item) => {
                    return <div className="pagination-item d-flex align-items-center justify-content-center">{item}</div>;
                })}
            </div>
        )
    }
}