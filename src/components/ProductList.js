import React from "react";

import withContext from "../withContext";

import ProductItem from "./ProductItem";
import Search from "./Search";

const ProductList = props => {
  const { products, setProducts } = props.context;

  const handleSearch = async searchQuery => {
    let params = {
      "text": searchQuery,
    };
    
    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

    const response = await fetch('http://localhost:3001/search?' + query)
    const products = await response.json()
    setProducts(products)
  }

  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Our Products</h4>
        </div>
      </div>
      <br />

      <Search handleSearch={handleSearch}/>
      <br />
      
      <div className="container">
        <div className="column columns is-multiline">
          {products && products.length ? (
            products.map((product, index) => (
              <ProductItem
                product={product}
                key={index}
                addToCart={props.context.addToCart}
                selectProduct={props.context.selectProduct}
              />
            ))
          ) : (
            <div className="column">
              <span className="title has-text-grey-light">
                No products found!
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withContext(ProductList);
