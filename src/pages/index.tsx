import React from "react";
import MainBody from "../components/MainBody";

// Main Body SECTION
const mainBody = {
    gradientColors: "#CDBAA6, #CDC1A6, #CBBCA5, #CBB2A5",
    message: " From Artificial ",
    message2: " to Natural ",
    rights: "© Shot Bots. All Rights Reserved.",
    icons: [
        {
            image: "fa-twitter",
            url: "https://twitter.com/XbotsOnSol",
        },
    ],
};

const Home = () => {
    return (
        <>
            <MainBody
                gradient={mainBody.gradientColors}
                message={mainBody.message}
                message2={mainBody.message2}
                rights={mainBody.rights}
                icons={mainBody.icons}
            />
        </>
    );
};

Home.displayName = "Home";

export default Home;
