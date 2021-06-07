import React from "react";
import withContext from "../withContext";
import CartItem from "./CartItem";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51IyCRZCa2wJHdPnSsdY7TqiIcsCHdz4ewS1RLsRd2XE5uBbl3ExUcqL7ji3ocTW7qcjK6krmxOxghUo2cCXuwg8s00xZaRDK7U');

const Cart = props => {
  const { selected } = props.context

  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Computer Configuration</h4>
        </div>
      </div>
      <br />
      
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Price</th>
          </tr>
        </thead>
      </table>
    </>
  );
};

export default withContext(Configuration);