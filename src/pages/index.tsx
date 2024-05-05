import React from "react";
import MainBody from "../components/MainBody";

// Main Body SECTION
const mainBody = {
    gradientColors: "#CDBAA6, #CDC1A6, #CBBCA5, #CBB2A5",
    title: "SHOT",
    name: "BOTS",
    message: " From Artificial ",
    message2: " to Natural ",
    rights: "© Shot Bots. All Rights Reserved.",
    icons: [
        {
            image: "fa-twitter",
            url: "https://twitter.com/TheShotBots",
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
                rights={mainBody.rights}
                icons={mainBody.icons}
            />
        </>
    );
});

export default Home;
