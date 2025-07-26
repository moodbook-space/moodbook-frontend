import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

export const ProfileSection = styled.section`
  display: flex;
  flex-direction: row;
  column-gap: 30px;
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export const ProfileImage = styled.img`
  width: 200px;
  height: auto;
`;

export const ProfileTexts = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;
