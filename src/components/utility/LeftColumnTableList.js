import React from 'react';

const LeftColumnTableList = (props) => {
  console.log("inside table list:");
  console.log(props.header);
  console.log(props.data);
  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th scope="col">Ngày</th>
            {props.header.map((item) => { return <th scope="col" key={item}>{item}</th> })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((item) => {
            return (
              <tr key={item.date}>
                <th scope="row">{item.date}</th>
                {props.header.map((hd) => {
                  return item[hd] !== 0 ? <td key={item.date + item[hd]}>{item[hd]}</td> : <td></td>
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
