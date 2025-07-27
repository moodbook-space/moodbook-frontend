import { Button } from 'antd';
import styled from 'styled-components';

export const SignUpButton = styled(Button)`
  all: unset;
  width: 100%;
  height: 44px;
  background-color: #e0e0e0;
  color: #333;
  border-radius: 6px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #d5d5d5;
  }
`;
