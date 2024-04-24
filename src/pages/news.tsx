import type {NextPage} from "next";
import Head from "next/head";
import {NewsView} from "../views";

const News: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>News</title>
            </Head>
            <NewsView/>
        </div>
    );
};

export default News;
