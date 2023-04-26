import React from "react"

/**
 * Creates the UI for the searchbar.
 * 
 * @param onSearch the function to use for the onChange event of the user input.
 *
 *  @author Melinda Vestberg (dv20mvg), Rasmus Lyxell (c19rll)
 */
const SearchBar = ({ onSearch }) => {
	return (
		<center>
			<div  className="container search"  >
				<div className="row search">
					<div className="input-group rounded">
						<input type="search" className="form-control rounded" placeholder="Sök" aria-label="Search" aria-describedby="search-addon" onChange={onSearch}  />
                    
						<div className="svg-search">
							<img src="/search.svg" alt="search icon"/>
						</div>
					</div>
				</div>
			</div>
		</center>
	)
}

export default SearchBar