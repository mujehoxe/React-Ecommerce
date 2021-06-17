import React from "react";

const Search = ({handleSearch}) => {
	let textInput = React.createRef();

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
      handleSearch(textInput.current.value)
    }
	}

	const handleButtonClick = e => {
		handleSearch(textInput.current.value)
	}

	return (
		<div className="column">
			<div className="field has-addons is-justify-content-center">
				<div className="control">
					<input className="input" ref={textInput} onKeyDown={handleKeyDown} type="text" placeholder="Find a products" />
				</div>
				<div className="control">
						<a className="button is-info" onClick={handleButtonClick}>
							Search
						</a>
				</div>
			</div>
		</div>
	)
}

export default Search;