import React from "react";

const BuildItem = props => {
  const { product } = props;

  return (
    <div className=" column is-half">
      <div className="media">
        <div className="media-left">
          <figure className="image is-48x48">
            <img
                src={product.image}
                alt={product.name}
            />
          </figure>
        </div>
        <div className="media-content">
          <b style={{ textTransform: "capitalize" }}>
            {product.name}{" "}
          </b>
        </div>
      </div>
    </div>
  );
};

export default BuildItem;
