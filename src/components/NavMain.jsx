import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const NavMain = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <h3 onClick={() => navigate("./home")}>Yen Chat</h3>
      <button>=</button>
    </Container>
  );
};

export default NavMain;

const Container = styled.div`
  color: white;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;
