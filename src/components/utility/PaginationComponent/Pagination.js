import React from 'react';

import styles from './pagination.module.css';

class Pagination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalPage: 0,
            totalElement: 0,
            currentPage: 0,
            rowPerPage: 0,
            button: null,
            activeIdx: -1,
            showDotOne: false,
            showDotTwo: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        const totalPage = props.data.totalPage;
        const currentPage = parseInt(props.data.currentPage);
        let buttonArr = [];
        let activeIdx = 0;
        let showDotOne = false;
        let showDotTwo = false;

        if (totalPage >= 7) {
            if (currentPage <= 4) {
                buttonArr = ['1', '2', '3', '4', '5', '6', '7'];
                activeIdx = currentPage - 1;
                showDotOne = false;
                showDotTwo = true;
            } else if (currentPage >= totalPage - 3) {
                buttonArr = [(totalPage - 6) + '', (totalPage - 5) + '', (totalPage - 4) + '', (totalPage - 3) + '', (totalPage - 2) + '', (totalPage - 1) + '', totalPage + ''];
                activeIdx = 6 - (totalPage - currentPage);
                showDotOne = true;
                showDotTwo = false;

            } else {
                buttonArr = [(currentPage - 3) + '', (currentPage - 2) + '', (currentPage - 1) + '', currentPage + '', (currentPage + 1) + '', (currentPage + 2) + '', (currentPage + 3) + ''];
                activeIdx = 3;
                showDotOne = true;
                showDotTwo = true;
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
            button: buttonArr,
            showDotOne: showDotOne,
            showDotTwo: showDotTwo
        }
    }

    moveToCurrentPage(currentPage) {
        if (1 <= currentPage && currentPage <= this.state.totalPage) {
            this.props.onSelectCurrentPage(currentPage);
        }
    }

    render() {
        return (
            <ul className={styles.paginationCustom + ' pagination'}>
                <li className="page-item" onClick={() => {
                    this.moveToCurrentPage(this.state.currentPage - 1);
                }}><div className="page-link">Previous</div></li>
                {this.state.showDotOne ? <li className="page-item" disabled><div className="page-link">...</div></li> : null}

                {this.state.button.map((item, idx) => {
                    return <li key={idx} className={'page-item ' + (this.state.activeIdx === idx ? 'active' : '')} onClick={() => {
                        this.moveToCurrentPage(item);
                    }}><div className="page-link">{item}</div></li>
                })}
                {this.state.showDotTwo ? <li className="page-item" disabled><div className="page-link">...</div></li> : null}
                <li className="page-item" onClick={() => {
                    this.moveToCurrentPage(this.state.currentPage + 1);
                }}><div className="page-link">Next</div></li>
            </ul>
        )
    }
}

export default Pagination;
