import React from "react";

const BuildItem = props => {
  const { product } = props;
  console.log(props)

  return (
    <div className=" column is-half">
      <div className="media">
        <div className="media-left">
          <figure className="image is-48x48">
            <img
              src="https://bulma.io/images/placeholders/48x48.png"
              alt={product.shortDesc}
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
