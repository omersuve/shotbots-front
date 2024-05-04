import React from "react";
import MainBody from "../components/MainBody";

// Main Body SECTION
const mainBody = {
    gradientColors: "#1f1c19, #2C1E11, #1C0F0A, #2d270a",
    title: "SHOT",
    name: "BOTS",
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
