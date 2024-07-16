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
import { formatLargeNumber } from "../../utils/formatting";

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
        const tokenMatch = text.match(/[$#][A-Z]+/);
        const telegramMatch = text.match(/(t\.me\/\+[\w\d]+|@[A-Za-z\d_]+)/);

        return {
            url: urlMatch ? urlMatch[0] : null,
            token: tokenMatch ? tokenMatch[0] : null,
            telegram: telegramMatch ? telegramMatch[0] : null,
        };
    };

    return (
      <div className={styles.container}>
          <ul className={styles.messageList}>
              {messages.slice().map((message, index) => {
                  const { url, token, telegram } = extractInfo(message.text);
                  const scores = message.scores; // Example scores, replace with real scores
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
                        {message.rugcheck && (
                          <div className={styles.rugcheck}>
                              <p><strong>Risks:</strong> {message.rugcheck.risks.join(", ")}</p>
                              <p><strong>Total LP Providers:</strong> {message.rugcheck.totalLPProviders}</p>
                              <p><strong>Total Market
                                  Liquidity:</strong> {formatLargeNumber(message.rugcheck.totalMarketLiquidity)}</p>
                          </div>
                        )}
                        <div className={styles.toggleButtonContainer}>
                            <button
                              className={styles.toggleButton}
                              onClick={() => toggleGraphVisibility(index)}
                            >
                                {visibleGraphs[index] ? "Hide Sentiments" : "Show Sentiments"}
                            </button>
                        </div>
                        {visibleGraphs[index] && (
                          <div className={styles.graphContainer}>
                              <GraphComponent scores={scores} startDate={message.date} />
                          </div>
                        )}
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
    scores: (number | null)[];
    startDate: string;
};

const GraphComponent: FC<GraphComponentProps> = ({ scores, startDate }) => {
    const labels = scores.map((_, index) => {
        const date = new Date(startDate);
        date.setMinutes(date.getMinutes() + index * 30);
        return date;
    });

    const data = {
        labels,
        datasets: [
            {
                label: "Scores",
                data: scores,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                pointRadius: 6, // Adjust point radius here
                pointHoverRadius: 8, // Adjust hover point radius here
            },
        ],
    };

    const options = {
        scales: {
            x: {
                ticks: {
                    padding: 10,
                    font: {
                        size: 10,
                    },
                    callback: function(value: any, index: number) {
                        const date = labels[index];
                        const formattedDate = date.toLocaleDateString();
                        const formattedTime = date.toLocaleTimeString();
                        return `${formattedDate}\n${formattedTime}`;
                    },
                },
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `Score: ${context.parsed.y}`;
                    },
                },
            },
        },
        maintainAspectRatio: false, // Allows for flexible resizing
    };

    return (
      <div style={{ height: "200px" }}>
          <Line data={data} options={options} />
      </div>
    );
};

export default GraphComponent;

