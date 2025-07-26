import styled from 'styled-components';
import { Card as AntdCard } from 'antd';

export const Wrapper = styled.section`
  padding: 0px 20px;
`;

export const Card = styled(AntdCard)`
  margin: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 40px;
  padding-bottom: 12px;
  width: 200px;
  height: 320px;
`;

export const Texts = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

export const Title = styled.button`
  all: unset;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  flex-direction: column;
  row-gap: 2px;
  font-weight: 700;

  cursor: pointer;
`;

export const Description = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  font-size: 12px;
  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Cover = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

export const CustomArrow = styled.div`
  display: block;

  &::before {
    color: black;
  }
`;
