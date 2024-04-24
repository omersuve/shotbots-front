import type {NextPage} from "next";
import Head from "next/head";
import {HomeView} from "../views";

const Dashboard: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>
            <HomeView/>
        </div>
    );
};

export default Dashboard;
