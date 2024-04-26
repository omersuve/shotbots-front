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
    ({gradient, title, name, message, message2, XXX, message3, icons}: any) => {
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
                <div className="position-relative">
                    <Image className="object-cover btn-circle opacity-80"
                           src={logo4}
                           width={120}
                           height={120}
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
                    <h1 className="display-1 text-6xl fw-bold fs-16 text-yellow-200 mb-4">
                        <span className="text-yellow-200 m-2 text-9xl fw-bolder">{title}</span>{name}
                    </h1>
                    <Typist typingDelay={30} backspaceDelay={50}>
                        <div className="text-center h-24">
                            <div className="lead typist fs-5">
                                {message}
                            </div>
                            <Typist.Delay ms={250}/>
                            <div className="lead typist fs-5">
                                {message2}
                            </div>
                            <Typist.Delay ms={250}/>
                            <div className="lead typist fs-4 fw-bolder">
                                {XXX}
                                <Typist.Backspace count={10}/>
                            </div>
                            <Typist.Delay ms={250}/>
                            <div className="lead typist fs-6 fw-bolder">
                                {message3}
                            </div>
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
                                <i className={`fab ${icon.image}  fa-3x socialicons`}/>
                            </a>
                        ))}
                    </div>
                    <a
                        className={`btn bg-transparent border-white text-white hover:bg-black ${styles["btn-outline-light"]}`}
                        href="/dashboard/"
                        role="button"
                        aria-label="Learn more about me"
                    >
                        Stay tuned
                    </a>
                </Container>
            </Jumbotron>
        );
    }
);

export default MainBody;
