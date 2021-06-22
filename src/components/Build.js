import React from "react";

import withContext from "../withContext";

import BuildTableRow from "./BuildTableRow"

const Build = props => {
  const { selectedProducts } = props.context

  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Computer Configuration</h4>
        </div>
      </div>
      <br />
      {selectedProducts.cpu && selectedProducts.motherboard && (
        selectedProducts.cpu.socket === selectedProducts.motherboard.socket  ? (
          <div class="notification is-success is-outlined">Components are compatible</div>
        ) : (
          <div class="notification is-warning is-outlined">Components are not compatible</div>
        )
      )}

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

export default withContext(Build)