import React from 'react';

const customStyle = (day) => {
  let color = '';
  if (day === 5) {
    color = '#C8E6C9'
  } else if (day === 6) {
    color = '#FFF9C4'
  }

  return {
    'cursor': 'pointer',
    'backgroundColor': color
  }
}

class LeftColumnTableList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th scope="col">Ngày</th>
              {this.props.header.map((item) => { return <th scope="col" key={item}>{item}</th> })}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((item, idx) => {
              const day = new Date(item.date).getDay();
              return (
                <tr style={customStyle(day)} key={idx} onClick={() => {
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
