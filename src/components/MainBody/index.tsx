import React from "react";
import Container from "react-bootstrap/Container";
import Typist from "react-typist-component";
import styles from "./index.module.css";
import logo from "../../../public/target.webp";
import news from "../../../public/newspaper.webp";
import TextLogoBlack from "../../../public/black.png";
import Image from "next/image";
import Link from "next/link";

export const Jumbotron = (props: any) => {
    const bgStyle = props.style ?? { backgroundColor: "#e9ecef" };
    return (
        <div id={props.id} className={`py-3 ${props.className}`} style={bgStyle}>
            <div className="container py-5">
                {props.children}
            </div>
        </div>
    );
};

const MainBody = ({ gradient, message, message2, icons }: any) => {
    return (
        <Jumbotron
            fluid
            id="home"
            style={{
                background: `linear-gradient(360deg,${gradient})`,
                backgroundSize: "100% 100%",
                overflow: "hidden",
            }}
            className="title bg-transparent bgstyle text-light min-vh-100 d-flex align-content-center align-items-center flex-wrap m-0"
        >
            <div id="stars"></div>
            <div className={`${styles["img-rectangular-top"]} object-cover`}>
                <Image className="object-cover"
                       src={TextLogoBlack}
                       width={300}
                       height={150}
                       alt="Logo" />
            </div>
            <div className="right-52 position-absolute">
                <Image className={`${styles["img-rectangular-left"]} object-cover`}
                       src={logo}
                       width={150}
                       height={150}
                       alt="Picture of a Mask2" />
            </div>
            <div className="left-52 position-absolute">
                <Image className={`${styles["img-rectangular-right"]} object-cover`}
                       src={news}
                       width={150}
                       height={150}
                       alt="Picture of a Pistol" />
            </div>
            <Container className="text-center">
                <Typist typingDelay={60} backspaceDelay={100}>
                    <div className={`${styles["typist-font"]} text-center fs-3`}>
                        <p className="inline pointer-events-none">
                            <span>{message}</span>
                            <Typist.Delay ms={150} />
                            <span>{message2}</span>
                        </p>
                    </div>
                </Typist>
                <Link href="/dashboard" passHref>
                    <div className={`${styles["stay-tuned"]} btn border-black text-black hover:bg-yellow-900`}>
                        Take a Shot!
                    </div>
                </Link>
                <div className="p-4 mt-2 opacity-75 justify-items-center text-center items-center">
                    {icons.map((icon: { url: string | undefined; image: string; }, index: any) => (
                        <Link href={icon.url!} passHref={true} key={`social-icon-${index}`} target="_blank">
                            <i className={`fab ${icon.image}  fa-2x socialicons`} />
                        </Link>
                    ))}
                </div>
                <p className={`${styles["rights"]} md:absolute md:right-10 md:bottom-10 text-center fs-6`}>&copy; {new Date().getFullYear()} Shot
                    Bots. All rights reserved.</p>
                <p className={`${styles["rights"]} md:absolute md:left-10 md:bottom-8 text-center fs-6 grid`}>
                    <span className="fs-6 ml-2 fw-bolder">REACH OUT FOR INQUIRIES:</span><span
                    className="fs-6 ml-2">theshotbots@gmail.com</span>
                </p>
            </Container>
        </Jumbotron>
    );
};

export default MainBody;
