import React from "react";

import BuildTableRow from "./BuildTableRow"

const Build = props => {
  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Computer Configuration</h4>
        </div>
      </div>
      <br />
      
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Type</th>
            <th>Selected</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <BuildTableRow type="cpu" title="CPU"/>
          <BuildTableRow type="motherboard" title="Motherboard"/>
          <BuildTableRow type="gpu" title="Graphics Card"/>
        </tbody>
      </table>
    </>
  );
};

export default Build;