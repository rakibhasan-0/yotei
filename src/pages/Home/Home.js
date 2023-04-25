import HomePageLogoButton from '../../components/Home/HomePageLogoButton';
import './Home.css';

/**
 * This is the Home page, after logging in the user will see this page, where the user 
 * can find links to other pages. 
 * 
 * @author Team Capricciosa (Group 2)
 * @version 1.0
 */
function Home() {
    return (
        <div>
            <div className="container home-container">
                {/* All links route to the activity page, since none of the other pages has been implemented yet. */}
                <HomePageLogoButton buttonName="Pass" linkTo="/workout"/>
                <HomePageLogoButton buttonName="Övningar" linkTo="/exercise"/>
                <HomePageLogoButton buttonName="Tekniker" linkTo="/technique"/>
                <HomePageLogoButton buttonName="Grupp" linkTo="/plan"/>
            </div>
        </div>
    );
}

export default Home;