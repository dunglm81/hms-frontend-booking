import React from 'react';

const LeftColumnTableList = (props) => {
  return (
    <div className="table-responsive" searchBooking={props.searchBooking}>
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th scope="col">Ngày</th>
            {props.header.map((item) => { return <th scope="col" key={item}>{item}</th> })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, idx) => {
            return (
              <tr key={idx} onClick={() => {
                props.searchBooking(item.date);
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
