import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 60px;
  row-gap: 40px;
`;

export const BookInfo = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 20px;
`;

export const Texts = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

export const Title = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

export const DetailList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 14px;
  padding-inline-start: 1.5em;
  margin: 0;
  white-space: pre;
`;

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

export const ReviewerName = styled.div`
  font-size: 16px;
  font-weight: 700;
  padding-bottom: 10px;
`;
