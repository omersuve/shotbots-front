import type { NextPage } from "next";
import Head from "next/head";
import { PortfolioView } from "../views";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Sidebar from "../components/Sidebar";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_LEFT,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const Portfolio: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Portfolio</title>
      </Head>
      <AlertProvider template={AlertTemplate} {...options}>
        <PortfolioView />
        <Sidebar/>
      </AlertProvider>
    </div>
  );
};

export default Portfolio;
