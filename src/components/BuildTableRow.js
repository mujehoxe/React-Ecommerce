import React from "react";
import { useHistory } from "react-router-dom";

import withContext from "../withContext";

import BuildItem from "./BuildItem";

const BuildTableRow = props => {
  const { selectedProducts } = props.context

  let history = useHistory();
  
  return (
    <tr>
      <th><a href={`/products?type=${props.type}`}>{props.title}</a></th>
      {selectedProducts[props.type] ? (
        <>
        <td>
          <BuildItem product={selectedProducts[props.type]}></BuildItem>
        </td>
        <td></td>
        </>
      ) : (
        <>
        <td>
          <button className='button' onClick={() => history.push(`/products?type=${props.type}`)}>Select Product</button>
        </td>
        <td></td>
        </>
      )}  
    </tr>
  )
}

export default withContext(BuildTableRow);