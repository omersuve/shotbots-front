import React from "react";
import MainBody from "../components/MainBody";

// Main Body SECTION
const mainBody = {
    gradientColors: "#1f1c19, #33291c, #2b1f07, #3d270a",
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
