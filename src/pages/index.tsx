import React from "react";
import MainBody from "../components/MainBody";
import Head from "next/head";

// Main Body SECTION
const mainBody = {
    gradientColors: "#CA7C4A, #CB8638, #B26C00, #C67E0F",
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

const Home = () => {
    return (
        <>
            <Head>
                <title>Shot Bots</title>
            </Head>
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
