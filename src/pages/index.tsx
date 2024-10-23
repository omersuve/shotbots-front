import React from "react";
import MainBody from "../components/MainBody";
import Head from "next/head";

// Main Body SECTION
const mainBody = {
  gradientColors: "#a7937a, #d4bdb1, #ceb1a0, #d3bb98",
  message: " From Artificial ",
  message2: " to Natural ",
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
      />
    </>
  );
};

Home.displayName = "Home";

export default Home;
