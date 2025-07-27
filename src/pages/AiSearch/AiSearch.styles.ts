import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 70%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 0px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const AiChatBubble = styled.div`
  align-self: flex-start;
  padding: 10px;
  border: 1px solid #f2f2f2;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Book = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  margin-top: 10px;
`;

export const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UserChatBubble = styled.div`
  align-self: flex-end;
  padding: 10px;
  border: 1px solid #f2f2f2;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f2f2f2;
`;
