import React, { FC, useState } from "react";
import styles from "./index.module.css";
import { useTrending } from "../../contexts/TrendingContext";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

export const TrendingView: FC = () => {
    const { messages } = useTrending();
    const [visibleGraphs, setVisibleGraphs] = useState<{ [key: number]: boolean }>({});

    const toggleGraphVisibility = (index: number) => {
        setVisibleGraphs((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const extractInfo = (text: string) => {
        const urlMatch = text.match(/(https?:\/\/[^\s)]+)/);  // Updated regex to exclude the trailing ')'
        const tokenMatch = text.match(/\$[A-Z]+/);
        const telegramMatch = text.match(/(t\.me\/\+[\w\d]+|@[A-Za-z\d_]+)/);

        return {
            url: urlMatch ? urlMatch[0] : null,
            token: tokenMatch ? tokenMatch[0] : null,
            telegram: telegramMatch ? telegramMatch[0] : null,
        };
    };

    return (
      <div className={styles.container}>
          <h1 className={styles.header}>Trending Tickers</h1>
          <ul className={styles.messageList}>
              {messages.slice().reverse().map((message, index) => {
                  const { url, token, telegram } = extractInfo(message.text);
                  const scores = [10, 20, 30, 40]; // Example scores, replace with real scores
                  return (
                    <li key={index} className={styles.messageItem}>
                        <div className={styles.messageDate}>{new Date(message.date).toLocaleString()}</div>
                        {token && <p><strong>Token:</strong> {token}</p>}
                        {telegram && (
                          <p>
                              <strong>Telegram:</strong>{" "}
                              <Link
                                href={`https://${telegram.startsWith("@") ? `t.me/${telegram.slice(1)}` : telegram}`}
                                target="_blank">
                                  {telegram}
                              </Link>
                          </p>
                        )}
                        {url && (
                          <p>
                              <strong>Dexscreener:</strong>{" "}
                              <Link href={url} target="_blank">
                                  {url}
                              </Link>
                          </p>
                        )}
                        <div className={styles.messageScore}>
                            <strong>Score:</strong> {message.score}
                            <button
                              className={styles.toggleButton}
                              onClick={() => toggleGraphVisibility(index)}
                            >
                                {visibleGraphs[index] ? "Hide Graph" : "Show Graph"}
                            </button>
                        </div>
                        {visibleGraphs[index] && <GraphComponent scores={scores} startDate={message.date} />}
                    </li>
                  );
              })}
          </ul>
      </div>
    );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type GraphComponentProps = {
    scores: number[];
    startDate: string;
};

const GraphComponent: FC<GraphComponentProps> = ({ scores, startDate }) => {
    const labels = scores.map((_, index) => {
        const date = new Date(startDate);
        date.setHours(date.getHours() + index);
        return date.toLocaleString();
    });

    const data = {
        labels,
        datasets: [
            {
                label: "Scores",
                data: scores,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default GraphComponent;

