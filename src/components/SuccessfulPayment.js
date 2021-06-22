import React, { useRef } from "react";

import withContext from "../withContext";

const useConstructor = (callBack = () => {}) => {
	const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
	hasBeenCalled.current = true;
  callBack();
}

const SuccessfulPayment = props => {
  const { clearCart } = props.context

	useConstructor(() => {
		clearCart()
	})

  return (
		<div className="hero is-primary">
			<div className="hero-body container">
				<h4 className="title">Congratulations, your payment was successful.</h4>
			</div>
		</div>
  );
};

export default withContext(SuccessfulPayment)