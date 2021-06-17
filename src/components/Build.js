import React from "react";
import { useHistory } from "react-router-dom";

import withContext from "../withContext";

import CartItem from "./CartItem";
import BuildItem from "./BuildItem";

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51IyCRZCa2wJHdPnSsdY7TqiIcsCHdz4ewS1RLsRd2XE5uBbl3ExUcqL7ji3ocTW7qcjK6krmxOxghUo2cCXuwg8s00xZaRDK7U');

const Build = props => {
  const { selectedProducts } = props.context
  let history = useHistory();

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
          <tr>
            <th><a href="/products?type=cpu" title="CPU">CPU</a></th>
            {selectedProducts['cpu'] ? (
              <>
              <td>
                <BuildItem product={selectedProducts['cpu']}></BuildItem>
              </td>
              <td></td>
              </>
            ) : (
              <>
              <td>
                <button className='button' onClick={() => history.push("/products?type=cpu")}>Select Product</button>
              </td>
              <td></td>
              </>
            )}  
          </tr>
          <tr>
            <th><a href="/products?type=cpu" title="CPU">Motherboard</a></th>
            {selectedProducts['motherboard'] ? (
              <>
              <td>
                <BuildItem product={selectedProducts['motherboard']}></BuildItem>
              </td>
              <td></td>
              </>
            ) : (
              <>
              <td>
                <button className='button' onClick={() => history.push("/products?type=cpu")}>Select Product</button>
              </td>
              <td></td>
              </>
            )}  
          </tr>
        
        </tbody>
      </table>
    </>
  );
};

export default withContext(Build);