import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AccountContext } from "../../context";
import Spinner from "../../components/Common/Spinner/Spinner";
import style from "./Statistics.module.css";
import Button from "../../components/Common/Button/Button";
import StatisticsPopUp from "./StatisticsPopUp";
import FilterStatistics from "./FilterStatistics";

export default function Statistics() {
<<<<<<< HEAD
  const navigate = useNavigate();
  const { groupID } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AccountContext);

  useEffect(() => {
	async function fetchGroupData() {
      try {
        console.log("Fetching group data for ID:", groupID);
        const response = await fetch("/api/plan/all", { headers: { token } });

        if (!response.ok) {
          throw new Error("Failed to fetch group data");
        }
        const data = await response.json();
        const groupData = data.find((group) => group.id === parseInt(groupID));
        setGroup(groupData);
      } catch (error) {
        console.error("Fetching error:", error); // proper handling of error should be implemented
      } finally {
        setLoading(false);
      }
    }

    fetchGroupData();
  }, [groupID, token]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <h1 style={{ fontSize: "35px" }}>
          {group ? `${group.name}` : "Gruppen hittades inte"}
        </h1>
      )}

      <div className={style.FilterAndSortContainer}>
        <FilterStatistics />
        <StatisticsPopUp />
      </div>


      <div className={style.buttonContainer}>
        <Button width="25%" outlined={true} onClick={() => navigate(-1)}>
          <p>Tillbaka</p>
        </Button>
      </div>
    </div>
  );
=======
	const navigate = useNavigate()
	const { groupID } = useParams()
	const [group, setGroup] = useState(null)
	const [loading, setLoading] = useState(true)
	const { token } = useContext(AccountContext)



	useEffect(() => {
		async function fetchGroupData() {
			try {
				console.log('Fetching group data for ID:', groupID)
				const response = await fetch("/api/plan/all", { headers: { token } })

				if (!response.ok) {
					throw new Error('Failed to fetch group data')
				}
				const data = await response.json()
				const groupData = data.find(group => group.id === parseInt(groupID))
				setGroup(groupData);

			} catch (error) {
				console.error('Fetching error:', error) // proper handling of error should be implemented
			} finally {
				setLoading(false)
			}
		}

		fetchGroupData()
	}, [groupID, token])


	return (
		<div>
			{loading ? <Spinner /> : <h1 style={{ fontSize: '35px' }}>{group ? `${group.name}` : 'Gruppen hittades inte'}</h1>}

			<div style={{ position: 'relative' }}>

				<FilterContainer id="filter-container" title="Filtering" numFilters={0}>

					<div className={style.dateContainer}>
						<h2>Från</h2>
						<div></div>
						<DatePicker
							id="start-date-picker"
							minDate={"2023-05-11"}
							maxDate={"2026-05-07"}
						/>
					</div>
					<div className={style.dateContainer}>
						<h2>Till</h2>
						<div></div>
						<DatePicker
							id="end-date-picker"
							minDate={"2023-05-11"}
							maxDate={"2026-05-07"}
						/>
					</div>
					<BeltPicker id={"techniqueFilter-BeltPicker"} onToggle={() => { }} states={[]} onClearBelts={() => { }} filterWhiteBelt={false} />

					<div className={style.checkboxContainer}>
						<h2>Visa övningar</h2>
						<div></div>
						<CheckBox id={"techniqueFilter-KihonCheck"} checked={false} onClick={() => { }} />
					</div>

				</FilterContainer>

				<StatisticsPopUp />

			</div>

			<div className={style.buttonContainer}>
				<Button width="25%" outlined={true} onClick={() => navigate(-1)}> <p>Tillbaka</p> </Button>
			</div>


		</div>
	)
>>>>>>> 58309dc50199d80ce65c8299ae55ff30ab7101d6
}
