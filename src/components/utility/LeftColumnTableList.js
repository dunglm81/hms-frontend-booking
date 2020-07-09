import React from 'react';

class LeftColumnTableList extends React.Component {

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-sm table-hover table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Ngày</th>
              {this.props.header.map((item) => { return <th scope="col" key={item}>{item}</th> })}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((item, idx) => {
              const day = new Date(item.date).getDay();
              return (
                <tr className={(day === 5 ? 'table-info' : '') + (day === 6 ? 'table-warning' : '')} key={idx} onClick={() => {
                  this.props.searchBooking(item.date);
                }}>
                  <th scope="row">{item.date}</th>
                  {this.props.header.map((hd, idx1) => {
                    return item[hd] !== 0 ? <td key={idx1}>{item[hd]}</td> : <td key={idx1}></td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default LeftColumnTableList;
