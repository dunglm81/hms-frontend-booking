import React from 'react';

const LeftColumnTableList = (props) => {

  function custom(day) {
    let color = '';
    if (day === 5) {
      color = '#C8E6C9'
    } else if (day === 6) {
      color = '#FFF9C4'
    }

    return {
      'cursor': 'pointer',
      'background-color': color
    }
  }

  return (
    <div className="table-responsive" searchbooking={props.searchbooking}>
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th scope="col">Ngày</th>
            {props.header.map((item) => { return <th scope="col" key={item}>{item}</th> })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, idx) => {
            const day = new Date(item.date).getDay();
            return (
              <tr style={custom(day)} key={idx} onClick={() => {
                props.searchbooking(item.date);
              }}>
                <th scope="row">{item.date}</th>
                {props.header.map((hd, idx1) => {
                  return item[hd] !== 0 ? <td key={idx1}>{item[hd]}</td> : <td key={idx1}></td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LeftColumnTableList;
