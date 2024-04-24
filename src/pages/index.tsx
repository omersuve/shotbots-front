import React from "react";
import MainBody from "../components/MainBody";

// Main Body SECTION
const mainBody = {
    gradientColors: "#5D421A, #7E611E, #5D421A, #7E611E",
    title: "X",
    name: "BOTS",
    message: " Your Market Insight Tool ",
    message2: " Empower Your Decisions towards Crypto ",
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
                title={mainBody.title}
                name={mainBody.name}
                message={mainBody.message}
                message2={mainBody.message2}
                icons={mainBody.icons}
            />
        </>
    );
});

export default Home;
