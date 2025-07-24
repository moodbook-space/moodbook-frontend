import styled from 'styled-components';

interface ButtonProps {
  $selected: boolean;
  $backgroundColor: string;
}
export const Button = styled.button<ButtonProps>`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;

  background-color: ${({ $backgroundColor, $selected }) =>
    $selected ? $backgroundColor : 'transparent'};

  font-size: 1.5em;
  font-weight: 500;
  box-shadow: ${({ $selected }) =>
    $selected ? `2px 2px 4px rgba(0, 0, 0, 0.4)` : 'none'};

  cursor: pointer;
`;
