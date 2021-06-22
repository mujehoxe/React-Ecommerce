import React, { useState, useRef } from "react";

const useConstructor = (callBack = () => {}) => {
	const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
	hasBeenCalled.current = true;
  callBack();
}

const Search = ({ handleSearch, location }) => {
	const [ text, setText ] = useState("")
	const [ type, setType ] = useState("type")
	
	const constructQuery = () => {
		const params = {}
    
    if(text !== "") params.text = text
    if(type !== "type") params.type = type
		
		return '?' + Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');
	}
	
	useConstructor(() => {
		const params = new URLSearchParams(location.search)

		if(params.has("text")) setText(params.get("text"))
		if(params.has("type")) setType(params.get("type"))

		handleSearch(location.search)
	});

	const handleKeyDown = e => {
		if (e.key === 'Enter')
			handleSearch(constructQuery())
	}

	const handleButtonClick = e => {
		handleSearch(constructQuery())
	}

	return (
		<div className="columns is-variable is-1-mobile is-0-tablet is-3-desktop is-8-widescreen is-2-fullhd">
			<div className="column is-full">
				<div className="field has-addons has-addons-right is-justify-content-center">
					<div className="control">
						<div className="select">
							<select value={type} onChange={e => { setType(e.target.value )}}>
								<option defaultValue value="type">Type</option>
								<option value="cpu">CPU</option>
								<option value="motherboard">Motherboard</option>
								<option value="gpu">Graphics Card</option>
							</select>
						</div>
					</div>
					<div className="control">
						<input autoFocus className="input" value={text} onChange={e => { setText(e.target.value )}} onKeyDown={handleKeyDown} type="text" placeholder="Find a products" />
					</div>
					<div className="control">
							<a className="button is-info" onClick={handleButtonClick}>
								Search
							</a>
					</div>
				</div>	
			</div>		
		</div>
	)
}

export default Search;