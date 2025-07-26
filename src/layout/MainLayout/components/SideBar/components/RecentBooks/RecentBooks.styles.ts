import { CSSProperties } from 'react';
import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

export const Books = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const RecentBookImg = styled.img`
  width: 100px;
  height: auto;

  cursor: pointer;
`;

export const TextStyles: CSSProperties = {
  color: '#fff',
};
