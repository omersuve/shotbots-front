import React from "react";
import Container from "react-bootstrap/Container";
import Typist from "react-typist-component";
import styles from "./index.module.css";
import Mask from "../../../public/Mask.png"
import logo from "../../../public/logo.jpeg"
import logo4 from "../../../public/logo4.jpg"
import Mask2 from "../../../public/Mask2.png"
import TextLogo from "../../../public/text-logo.png"
import Image from 'next/image';
import Link from "next/link";

export const Jumbotron = (props: any) => {
    const bgStyle = props.style ?? {backgroundColor: "#e9ecef"};
    return (
        <div id={props.id} className={`py-3 ${props.className}`} style={bgStyle}>
            <div className="container py-5">
                {props.children}
            </div>
        </div>
    );
}

const MainBody = ({gradient, message, message2, rights, icons}: any) => {
    return (
        <Jumbotron
            fluid
            id="home"
            style={{
                background: `linear-gradient(136deg,${gradient})`,
                backgroundSize: "1200% 1200%",
                overflow: "hidden"
            }}
            className="title bg-transparent bgstyle text-light min-vh-100 d-flex align-content-center align-items-center flex-wrap m-0"
        >
            <div id="stars"></div>
            <div className={`${styles["img-rectangular-top"]} object-cover opacity-80`}>
                <Image className="object-cover opacity-80"
                       src={TextLogo}
                       width={300}
                       height={150}
                       alt="Logo"/>
            </div>
            <div className="float-right position-relative">
                <Image className={`${styles["img-rectangular-left"]} object-cover opacity-60`}
                       src={Mask2}
                       width={300}
                       height={300}
                       alt="Picture of a Mask2"/>
            </div>
            <div className="float-left position-relative">
                <Image className={`${styles["img-rectangular-right"]} object-cover opacity-60`}
                       src={Mask}
                       width={300}
                       height={300}
                       alt="Picture of a Mask"/>
            </div>
            <Container className="text-center">
                <Typist typingDelay={60} backspaceDelay={100}>
                    <div className={`${styles['typist-font']} text-center fs-3`}>
                        <p className="inline">
                            <span>{message}</span>
                            <Typist.Delay ms={150}/>
                            <span>{message2}</span>
                        </p>
                    </div>
                </Typist>
                <button disabled={true}
                        className={`${styles['stay-tuned']} btn border-black text-black hover:bg-yellow-900`}>
                    <Link href="/dashboard">Stay tuned</Link>
                </button>
                <div className="p-4 mt-10">
                    {icons.map((icon: { url: string | undefined; image: string; }, index: any) => (
                        <Link href={icon.url!} key={`social-icon-${index}`} target="_blank">
                            <i className={`fab ${icon.image}  fa-2x socialicons`}/>
                        </Link>
                    ))}
                </div>
                <p className={`${styles['rights']} absolute inset-x-10 bottom-5 text-center fs-3`}>{rights}</p>
            </Container>
        </Jumbotron>
    );
};

export default MainBody;
