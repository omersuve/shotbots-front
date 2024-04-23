import React from "react";
import MainBody from "../components/MainBody";

// Main Body SECTION
const mainBody = {
    gradientColors: "#365D8B, #267369, #9B6419, #523060, #A22C2C, #303B3E",
    firstName: "X",
    middleName: "",
    lastName: "Bots",
    message: " Your Market Insight Tool ",
    icons: [
        {
            image: "fa-twitter",
            url: "https://twitter.com/XbotsOnSol",
        },
    ],
};

const Home = React.forwardRef((props, ref) => {
    return (
        <>
            <MainBody
                gradient={mainBody.gradientColors}
                title={`${mainBody.firstName} ${mainBody.middleName} ${mainBody.lastName}`}
                message={mainBody.message}
                icons={mainBody.icons}
            />
        </>
    );
});

export default Home;
