import ReactDOM from "react-dom";
import styled from "styled-components";

const Modal = ({ children }) => {
  return ReactDOM.createPortal(
    <Conatiner>{children}</Conatiner>,
    document.getElementById("modal")
  );
};

export default Modal;

const Conatiner = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #11111178;
  z-index: 999;
`;
