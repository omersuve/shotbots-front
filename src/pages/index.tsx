import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import Sidebar from "../components/Sidebar";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <HomeView />
      <Sidebar/>
    </div>
  );
};

export default Home;
