import styled from "styled-components";

export const Button = styled.button`
  background-color: lightcyan;
  border: 1px solid #000;
  border-radius: 4px;
  color: #000;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;
`;

export const TextField = styled.input`
  border: 1px solid #000;
  flex-grow: 1;
  max-width: 600px;
  border-radius: 4px;
  font-size: 16px;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;

  padding: 12px 16px;
  border: 1px solid #10a37f;
  border-radius: 4px;
  outline-color: #10a37f;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;
