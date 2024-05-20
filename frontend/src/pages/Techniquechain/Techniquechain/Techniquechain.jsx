import { useState, useEffect, useContext } from "react"
import styles from "./Techniquechain.module.css"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import { useCookies } from "react-cookie"
import { Link, useLocation, useNavigate} from "react-router-dom"
import { AccountContext } from "../../../context"
import Spinner from "../../../components/Common/Spinner/Spinner"
import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"
import FilterContainer from "../../../components/Common/Filter/FilterContainer/FilterContainer"
import Sorter from "../../../components/Common/Sorting/Sorter"
import TechniquechainCard from "../../../components/Common/TechniquechainCard/TechniquechainCard"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { isEditor } from "../../../utils"
import { Plus } from "react-bootstrap-icons"




/**
 * The techniquechain page.
 * Fetches and displays the techniquechains.
 * 
 * @author Durian Team 3
 * @version 1.0
 * @since 2024-05-20
 */
export default function Techniquechain() {

	const sortOptions = [
		{label: "Namn: A-Ö", cmp: (a, b) => {return a.name.localeCompare(b.name)}},
		{label: "Namn: Ö-A", cmp: (a, b) => {return -a.name.localeCompare(b.name)}},
	]

	const detailURL = "/techniquechain/techniquechain_page/"
	const context = useContext(AccountContext)
	const cookieID = "techniquechain-filter-userId-"+context.userId
	const [cookies, setCookie] = useCookies([cookieID])
	const filterCookie = cookies[cookieID]
	const [searchBarText, setSearchBarText] = useState(filterCookie ? filterCookie.searchText : "")
	const [tags, setTags] = useState(filterCookie ? filterCookie.tags : [])
	const [suggestedTags, setSuggestedTags] = useState([])
	//const [showFilterBox, setShowFilterBox] = useState(false)
	const [loading, setIsLoading] = useState(false)
	const [sort, setSort] = useState(sortOptions[0])
	const [visibleList, setVisibleList] = useState([{id: 1, name: "test Kort 1"}, {id: 2, name: "test Kort 2"}, {id: 3, name: "test Kort 3"}])

	const saveSearchText = () => {
		localStorage.setItem("searchText", searchBarText)
	}
    
	return (
		<>
			<h1 id={"techniquechain-header"}></h1>
			<div>
				<SearchBar
					onBlur={saveSearchText}
					id="searchbar-technique"
					placeholder="Sök efter Teknikkedjor"
					text={searchBarText}
					onChange={setSearchBarText}
					addedTags={tags}
					setAddedTags={setTags}
					suggestedTags={suggestedTags}
					setSuggestedTags={setSuggestedTags}>
				</SearchBar>

				<FilterContainer id="ei-filter" title="Sortering" numFilters={0}>
					<Sorter onSortChange={setSort} id="ei-sort" selected={sort} options={sortOptions} />
				</FilterContainer>

				{ loading ? <Spinner/> :
					<div>
						<InfiniteScrollComponent>
							{ visibleList.map((exercise, index) => {
								return <TechniquechainCard
									item={exercise.name}
									key={exercise.id}
									id={exercise.id}
									detailURL={detailURL}
									index={index}>
								</TechniquechainCard>
							})}
						</InfiniteScrollComponent>
					</div>
				}
			</div>
			{/* Spacing so the button doesn't cover a exercise card */}
			<br/><br/><br/><br/><br/>

			{isEditor(context) && 
			<RoundButton linkTo={"chain/create"} id={"exercise-round-button"}  style={{maxWidth: "5px"}}>
				<Plus/>
			</RoundButton>
			}
		</>
	)
}