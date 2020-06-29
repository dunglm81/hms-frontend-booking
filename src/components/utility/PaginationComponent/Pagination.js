import React from 'react';

class Pagination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalPage: 0,
            totalElement: 0,
            currentPage: 0,
            rowPerPage: 0,
            button: null,
            activeIdx: -1
        }
    }

    static getDerivedStateFromProps(props, state) {
        const totalPage = props.data.totalPage;
        const currentPage = parseInt(props.data.currentPage);
        let buttonArr = [];
        let activeIdx = 0;

        if (totalPage >= 7) {
            if (currentPage <= 4) {
                buttonArr = ['1', '2', '3', '4', '5', '6', '7', '...'];
                activeIdx = currentPage - 1;
            } else if (currentPage >= totalPage - 3) {
                buttonArr = ['...', (totalPage - 6) + '', (totalPage - 5) + '', (totalPage - 4) + '', (totalPage - 3) + '', (totalPage - 2) + '', (totalPage - 1) + '', totalPage + ''];
                activeIdx = 7 - (totalPage - currentPage);
            } else {
                buttonArr = ['...', (currentPage - 3) + '', (currentPage - 2) + '', (currentPage - 1) + '', currentPage + '', (currentPage + 1) + '', (currentPage + 2) + '', (currentPage + 3) + '', '...'];
                activeIdx = 4;
            }
        } else {
            for (let i = 0; i < totalPage; i++) {
                buttonArr.push((i + 1) + '');
            }
            activeIdx = currentPage - 1;
        }

        return {
            totalPage: props.data.totalPage,
            totalElement: props.data.totalElement,
            currentPage: parseInt(props.data.currentPage),
            rowPerPage: parseInt(props.data.rowPerPage),
            activeIdx: activeIdx,
            button: buttonArr
        }
    }

    moveToCurrentPage(currentPage) {
        if (1 <= currentPage && currentPage <= this.state.totalPage) {
            this.props.onSelectCurrentPage(currentPage);
        }
    }

    render() {
        return (
            <ul className="pagination " key="pagination1">
                <li className="page-item" onClick={() => {
                    this.moveToCurrentPage(this.state.currentPage - 1);
                }}><a className="page-link">Previous</a></li>
                {this.state.button.map((item, idx) => {
                    return <li key={idx} className={'page-item ' + (this.state.activeIdx === idx ? 'active' : '')} key={item} onClick={() => {
                        this.moveToCurrentPage(item);
                    }}><a className="page-link">{item}</a></li>
                })}
                <li className="page-item" onClick={() => {
                    this.moveToCurrentPage(this.state.currentPage + 1);
                }}><a className="page-link">Next</a></li>
            </ul>
        )
    }
}

export default Pagination;
