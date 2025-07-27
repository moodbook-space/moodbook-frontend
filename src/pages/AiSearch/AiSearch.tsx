import { requestAskChat, RequestAskChatResponse } from '@/apis/openai';
import { KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';
import {
  AiChatBubble,
  Book,
  BookInfo,
  ChatContainer,
  Container,
  UserChatBubble,
} from './AiSearch.styles';
import { Image, Input, InputRef } from 'antd';
import { Paths } from '@/routes/routes';

interface AiChat {
  type: 'AI';
  data: RequestAskChatResponse;
}
interface UserChat {
  type: 'USER';
  data: {
    message: string;
  };
}
type Chat = AiChat | UserChat;

export const AiSearch = () => {
  const [isLoading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatInputText, setChatInputText] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 500);
  }, [chats]);

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      // * 한글 입력 시 엔터 키 두 번씩 동작할 수 있는 케이스 처리
      return;
    }
    if (event.key === 'Enter') {
      setLoading(true);
      setChats((prev) => [
        ...prev,
        { type: 'USER', data: { message: chatInputText } },
      ]);
      setChatInputText('');

      const response = await requestAskChat(chatInputText);
      const json = await response.json();
      setChats((prev) => [...prev, { type: 'AI', data: json }]);
      setLoading(false);
    }
  };

  const onImageClick = (bookId: number) => {
    window.open(`${Paths.BOOK}?id=${bookId}`, '_blank');
  };

  return (
    <Container>
      <ChatContainer ref={chatContainerRef}>
        {chats.map((message, index) => {
          if (message.type === 'AI') {
            return (
              <>
                <AiChatBubble key={index}>{message.data.mesaage}</AiChatBubble>
                {message.data.isbn13.map((book) => (
                  <Book key={book.bookId}>
                    <Image
                      preview={false}
                      src={book.coverImage}
                      width={100}
                      onClick={() => onImageClick(book.bookId)}
                    />
                    <BookInfo>
                      <div>
                        <b>{book.title}</b>
                      </div>
                      <div>{book.author}</div>
                    </BookInfo>
                  </Book>
                ))}
              </>
            );
          }

          if (message.type === 'USER') {
            return (
              <UserChatBubble key={index}>
                {message.data.message}
              </UserChatBubble>
            );
          }
        })}
      </ChatContainer>
      <Input
        ref={inputRef}
        disabled={isLoading}
        size='large'
        type='text'
        value={chatInputText}
        placeholder='어떤 책을 찾고 있으세요?'
        onKeyDown={onKeyDown}
        onChange={(event) => setChatInputText(event.target.value)}
      />
    </Container>
  );
};
