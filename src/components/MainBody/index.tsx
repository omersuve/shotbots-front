import React from "react";
import Container from "react-bootstrap/Container";
import Typist from "react-typist-component";
import styles from "./index.module.css";
import Mask from "../../../public/Mask.png"
import logo from "../../../public/logo.jpeg"
import logo4 from "../../../public/logo4.jpg"
import Mask2 from "../../../public/Mask2.png"
import Image from 'next/image';

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

const MainBody = React.forwardRef(
    ({gradient, title, name, message, message2, rights, icons}: any) => {
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
                {/*<div className="position-relative">*/}
                {/*    <Image className="object-cover btn-circle opacity-80"*/}
                {/*           src={logo4}*/}
                {/*           width={120}*/}
                {/*           height={120}*/}
                {/*           alt="Logo"/>*/}
                {/*</div>*/}
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
                    <h1 className="display-1 text-5xl fw-bold fs-16 text-yellow-200 mb-8">
                        <span className="text-yellow-200 m-4 text-5xl fw-bolder">{title}</span>{name}
                    </h1>
                    <Typist typingDelay={60} backspaceDelay={100}>
                        <div className="text-center h-20 fs-4">
                            <p>{message}</p>
                            <Typist.Delay ms={150}/>
                            <p>{message2}</p>
                        </div>
                    </Typist>
                    <div className="p-4">
                        {icons.map((icon: { url: string | undefined; image: string; }, index: any) => (
                            <a
                                key={`social-icon-${index}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={icon.url}
                                aria-label={`My ${icon.image.split("-")[1]}`}
                            >
                                <i className={`fab ${icon.image}  fa-2x socialicons`}/>
                            </a>
                        ))}
                    </div>
                    <button className="btn border-white text-white hover:bg-yellow-900">
                        <a href="/dashboard/">Stay tuned</a>
                    </button>
                    <p className="absolute inset-x-10 bottom-10">{rights}</p>
                </Container>
            </Jumbotron>
        );
    }
);

export default MainBody;
