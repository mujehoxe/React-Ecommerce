import React, { useState, useRef } from "react"
import withContext from "../withContext";

const useConstructor = (callBack = () => {}) => {
	const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
	hasBeenCalled.current = true;
  callBack();
}

const ProductItem = props => {
  const { product, index, selectProduct } = props
  const { selectedProducts } = props.context
  const [ checked, setChecked ] = useState(!!product.selected);

  let user = JSON.parse(localStorage.getItem("user"))

  useConstructor(() => {
    const selected = selectedProducts[product.type] 

    if( JSON.stringify(selected) === JSON.stringify(product) ){
      setChecked(true)
    }
  });

  const handleCheckChange = () => {
    selectProduct(index)
    
    const selected = selectedProducts[product.type]
    if( JSON.stringify(selected) === JSON.stringify(product) ){
      setChecked(!checked)
    }    
  }

  const handleAddToCart = () => {
    props.addToCart({
      id: product.name,
      product,
      amount: 1
    })
  }

  const handleAddToWaiting = () =>{
    console.log('add to waiting')
  }
  
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          
          <div className="media-left" style={{display: 'flex'}}>
            <input 
              type='checkbox'
              checked={checked}
              style={{margin: '.5em', alignSelf: 'center'}}
              onChange={handleCheckChange}
            />
            <figure className="image is-64x64">
              <img
                src={product.image}
                alt={product.name}
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <br/>
              <span className="tag is-primary">${product.price}</span>
              <br/>
            </b>
            {(product.socket &&
              <small className="has-text-grey">Socket: {product.socket}</small>
            )}
            <br/>
            {user && user.accessLevel < 1 ? [
              <>
              <small>{product.stock + " Available"}</small>
              <div className="is-clearfix">
                <button
                  className="button is-small is-outlined is-primary is-pulled-right"
                  onClick={handleAddToCart}
                >
                  Modify
                </button>
                <button
                  className="button is-small is-outlined is-danger is-pulled-right"
                  onClick={handleAddToCart}
                >
                  Delete
                </button>
              </div>
              </>
            ] : [
              product.stock > 0 ? (
                <>
                <small>{product.stock + " Available"}</small>
                <div className="is-clearfix">
                  <button
                    className="button is-small is-outlined is-primary is-pulled-right"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
                </>
              ) : (
                <>
                <small className="has-text-danger">Out Of Stock</small>
                <div className="is-clearfix">
                    <button
                      className="button is-small is-outlined is-danger is-pulled-right"
                      onClick={handleAddToWaiting}
                    >
                      Add to Waiting List
                    </button>
                  </div>
                </>
              )
            ]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withContext(ProductItem)
