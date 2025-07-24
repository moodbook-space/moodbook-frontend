import { Typography } from 'antd';
import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 30px;
`;

export const Paragraph = styled(Typography.Paragraph)`
  text-align: center;
  white-space: pre-wrap;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 50px;
`;
