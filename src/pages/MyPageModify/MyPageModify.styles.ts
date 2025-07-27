import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 2rem;
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 16px;
  object-fit: cover;
`;

export const UploadLabel = styled.label`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: lightgray;
  border-radius: 4px;
  cursor: pointer;
`;

export const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Label = styled.label`
  width: 120px;
  text-align: right;
`;

export const Input = styled.input`
  width: 300px;
  padding: 0.4rem;
`;

export const ButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
`;

export const SubmitButton = styled.button`
  padding: 0.6rem 1.2rem;
`;

export const WithdrawButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #ff5c5c;
  color: white;
  border: none;
`;
