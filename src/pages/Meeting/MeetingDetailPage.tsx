import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Heart,
  Eye,
  Calendar,
  Users,
  MapPin,
  MessageCircle,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useSearchParams } from 'react-router';
import { defaultFetch } from '@/apis';

// TypeScript 인터페이스 정의
interface MeetingDetail {
  id: number;
  title: string;
  content: string;
  hostName: string;
  hostId: number;
  meetingType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  startAt: string;
  endAt: string;
  capacity: number;
  location: string;
  viewCount: number;
  likeCount: number;
  currentParticipants: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likedByMe: boolean;
  chatRoomId: number | null;
}

interface CommentResponse {
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  isMine: boolean;
  replies: CommentResponse[];
}

interface ChatRoom {
  id: number;
  name: string;
  memberCount: number;
}

interface LikeStatus {
  likeCount: number;
  liked: boolean;
}

interface CurrentUser {
  id: number;
  name: string;
}

export const MeetingDetailPage: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const meetingId = searchParams.get('id') ?? '';

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({
    likeCount: 0,
    liked: false,
  });
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [commentsPage, setCommentsPage] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set(),
  );
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 1,
    name: '현재사용자',
  });

  // 채팅방 관련 상태
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<string>('');
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [isChatMember, setIsChatMember] = useState<boolean>(false);

  // 테스트 데이터
  const testMeeting: MeetingDetail = {
    id: 1,
    title: 'SF 소설 함께 읽어요! - 「프로젝트 헤일메리」',
    content: `안녕하세요! SF 소설을 사랑하는 분들과 함께 앤디 위어의 「프로젝트 헤일메리」를 읽고 토론하고 싶습니다.

이 책은 우주를 배경으로 한 과학적 모험 소설로, 읽는 내내 긴장감을 놓을 수 없는 흥미진진한 스토리를 자랑합니다. 

📚 진행 방식:
- 매주 3-4챕터씩 읽고 온라인으로 만나요
- 자유로운 분위기에서 감상을 나누고 토론해요
- 과학적 배경지식도 함께 탐구해봐요

🎯 이런 분들께 추천:
- SF 장르를 좋아하시는 분
- 과학적 사고를 즐기시는 분
- 깊이 있는 토론을 원하시는 분

많은 참여 부탁드립니다!`,
    hostName: 'SF매니아',
    hostId: 2,
    meetingType: 'ONLINE',
    startAt: '2024-12-25T19:00:00',
    endAt: '2024-12-25T21:00:00',
    capacity: 10,
    location: '온라인 (Zoom)',
    viewCount: 320,
    likeCount: 42,
    currentParticipants: 8,
    tags: ['신비로운', '긴장감', '우쾌한'],
    createdAt: '2024-12-20T10:00:00',
    updatedAt: '2024-12-22T15:30:00',
    likedByMe: true,
    chatRoomId: null,
  };

  const testChatRooms: ChatRoom[] = [
    { id: 1, name: 'SF 소설 토론방', memberCount: 15 },
    { id: 2, name: '북클럽 메인', memberCount: 25 },
    { id: 3, name: '독서 모임', memberCount: 8 },
  ];

  // 데이터 로드
  useEffect(() => {
    // ? API 호출?

    setLoading(true);
    setTimeout(() => {
      setMeeting(testMeeting);
      setLikeStatus({
        likeCount: testMeeting.likeCount,
        liked: testMeeting.likedByMe,
      });
      setChatRooms(testChatRooms);
      setLoading(false);

      // 호스트인지 확인을 위해 currentUser를 호스트로 설정 (테스트용)
      setCurrentUser({ id: 2, name: 'SF매니아' }); // 호스트로 설정
    }, 500);

    // 댓글 별도 로드
    fetchComments();
  }, []);

  // 채팅방 가입 상태 확인
  useEffect(() => {
    if (meeting && meeting.chatRoomId) {
      setIsChatMember(false);
    }
  }, [meeting]);

  const toggleLike = (): void => {
    setLikeStatus((prev) => ({
      likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1,
      liked: !prev.liked,
    }));
  };

  const addComment = (): void => {
    if (!newComment.trim()) return;

    const newCommentObj: CommentResponse = {
      id: Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: newComment,
      createdAt: new Date().toISOString(),
      isMine: true,
      replies: [],
    };

    setComments((prev) => [...prev, newCommentObj]);
    setNewComment('');
  };

  const fetchComments = async (page: number = 0): Promise<void> => {
    if (page === 0) setLoadingComments(true);

    try {
      // 실제 API 호출
      const response = await defaultFetch(
        `/api/posts/${meetingId}/comments?page=${page}&size=10`,
        { method: 'GET' },
      );
      const data: CommentResponse[] = await response.json();

      // 테스트 데이터
      if (page === 0) {
        setComments(data);
      } else {
        // 무한스크롤 시 추가 데이터 로드
        setComments((prev) => [...prev, ...data]);
      }
      setCommentsPage(page);
      setHasMoreComments(false); // 테스트에서는 더 이상 댓글 없음
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchReplies = async (parentCommentId: number): Promise<void> => {
    try {
      // 실제 API 호출
      const response = await defaultFetch(
        `/api/posts/${meetingId}/comments/${parentCommentId}/replies`,
        { method: 'GET' },
      );
      const replies: CommentResponse[] = await response.json();

      // 답글을 해당 댓글에 추가
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentCommentId ? { ...comment, replies } : comment,
        ),
      );

      // 해당 댓글을 확장 상태로 표시
      setExpandedComments((prev) => new Set([...prev, parentCommentId]));
    } catch (error) {
      console.error('답글 조회 실패:', error);
    }
  };

  const loadMoreComments = (): void => {
    if (!loadingComments && hasMoreComments) {
      fetchComments(commentsPage + 1);
    }
  };

  const handleRepliesToggle = (commentId: number): void => {
    if (expandedComments.has(commentId)) {
      // 답글 숨기기
      setExpandedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, replies: [] } : comment,
        ),
      );
    } else {
      // 답글 불러오기
      fetchReplies(commentId);
    }
  };

  const addReply = (parentCommentId: number): void => {
    if (!replyContent.trim()) return;

    const newReply: CommentResponse = {
      id: Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: replyContent,
      createdAt: new Date().toISOString(),
      isMine: true,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentCommentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment,
      ),
    );
    setReplyContent('');
    setReplyingTo(null);
  };

  const linkChatRoom = (): void => {
    if (!selectedChatRoom) return;

    setMeeting((prev) =>
      prev ? { ...prev, chatRoomId: parseInt(selectedChatRoom) } : null,
    );
    setShowChatModal(false);
    setSelectedChatRoom('');
  };

  const joinChatRoom = (): void => {
    setIsChatMember(true);
  };

  const enterChatRoom = (): void => {
    if (meeting?.chatRoomId) {
      window.location.href = `/chat-rooms/${meeting.chatRoomId}`;
    }
  };

  const deleteComment = (commentId: number): void => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const deleteReply = (commentId: number, replyId: number): void => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
          : c,
      ),
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getMeetingTypeColor = (type: string): string => {
    switch (type) {
      case 'ONLINE':
        return 'bg-blue-100 text-blue-800';
      case 'OFFLINE':
        return 'bg-green-100 text-green-800';
      case 'HYBRID':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeText = (type: string): string => {
    switch (type) {
      case 'ONLINE':
        return '온라인';
      case 'OFFLINE':
        return '오프라인';
      case 'HYBRID':
        return '하이브리드';
      default:
        return type;
    }
  };

  const renderChatButton = (): React.ReactNode => {
    if (!meeting) return null;

    const isHost = currentUser.id === meeting.hostId;

    if (isHost && meeting.chatRoomId === null) {
      return (
        <button
          onClick={() => setShowChatModal(true)}
          className='bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors'
        >
          채팅방 연결하기
        </button>
      );
    }

    if (meeting.chatRoomId !== null) {
      if (!isChatMember) {
        return (
          <button
            onClick={joinChatRoom}
            className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
          >
            채팅방 참여하기
          </button>
        );
      } else {
        return (
          <button
            onClick={enterChatRoom}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            채팅방 입장하기
          </button>
        );
      }
    }

    return null;
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600'></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-gray-500'>
          모임을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* 사이드바 */}
      <div className='w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col'>
        <div className='p-6'>
          <div className='flex items-center space-x-2 mb-8'>
            <div className='w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>📚</span>
            </div>
            <span className='text-xl font-semibold text-slate-700'>
              MoodBook
            </span>
          </div>
        </div>

        <div className='p-6 border-t border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-3'>
            Recently Readed
          </h3>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>SF</span>
              </div>
              <div className='flex-1'>
                <div className='text-sm font-medium text-gray-900 mb-1'>
                  프로젝트 헤일메리
                </div>
                <div className='text-xs text-gray-500'>앤디 위어</div>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='w-12 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>문학</span>
              </div>
              <div className='flex-1'>
                <div className='text-sm font-medium text-gray-900 mb-1'>
                  데미안
                </div>
                <div className='text-xs text-gray-500'>헤르만 헤세</div>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='w-12 h-16 bg-gradient-to-b from-purple-400 to-purple-600 rounded flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>심리</span>
              </div>
              <div className='flex-1'>
                <div className='text-sm font-medium text-gray-900 mb-1'>
                  사피엔스
                </div>
                <div className='text-xs text-gray-500'>유발 하라리</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className='flex-1 flex flex-col'>
        {/* 상단바 */}
        <header className='bg-white border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button className='bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-slate-700 transition-colors'>
                <Search className='w-4 h-4' />
                <span>AI 검색</span>
              </button>
              <button className='text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors'>
                기본 선택
              </button>
            </div>

            <div className='flex-1 max-w-xl mx-8 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='검색어를 입력하세요'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500'
              />
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer'>
                관리자 페이지
              </span>
              <span className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer'>
                로그아웃
              </span>
              <button className='p-2 text-gray-600 hover:bg-gray-100 rounded-full'>
                <Bell className='w-5 h-5' />
              </button>
              <button className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                <User className='w-4 h-4 text-gray-600' />
              </button>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className='flex-1 p-6'>
          <button
            onClick={() => window.history.back()}
            className='flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>목록으로 돌아가기</span>
          </button>

          <div className='max-w-4xl mx-auto'>
            {/* 모임 정보 카드 */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6'>
              <div className='flex items-start justify-between mb-6'>
                <div className='flex-1'>
                  <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                    {meeting.title}
                  </h1>
                  <div className='flex items-center space-x-4'>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getMeetingTypeColor(meeting.meetingType)}`}
                    >
                      {getMeetingTypeText(meeting.meetingType)}
                    </span>
                    <div className='flex items-center space-x-1 text-sm text-gray-600'>
                      <Eye className='w-4 h-4' />
                      <span>{meeting.viewCount}</span>
                    </div>
                  </div>
                </div>

                {/* 게시글 수정/삭제 버튼 (호스트만) */}
                {currentUser.id === meeting.hostId && (
                  <div className='flex items-center space-x-2'>
                    <button className='text-gray-600 hover:text-blue-600 px-3 py-1 rounded transition-colors'>
                      수정
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('정말 삭제하시겠습니까?')) {
                          alert('게시글이 삭제되었습니다.');
                          window.history.back();
                        }
                      }}
                      className='text-gray-600 hover:text-red-600 px-3 py-1 rounded transition-colors'
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg'>
                <div className='flex items-center space-x-2'>
                  <User className='w-5 h-5 text-gray-600' />
                  <span className='text-gray-700'>{meeting.hostName}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Calendar className='w-5 h-5 text-gray-600' />
                  <span className='text-gray-700'>
                    {formatDate(meeting.startAt)} - {formatDate(meeting.endAt)}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Users className='w-5 h-5 text-gray-600' />
                  <span className='text-gray-700'>
                    {meeting.currentParticipants}/{meeting.capacity}명
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <MapPin className='w-5 h-5 text-gray-600' />
                  <span className='text-gray-700'>{meeting.location}</span>
                </div>
              </div>

              {meeting.tags && meeting.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-6'>
                  {meeting.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className='prose max-w-none mb-6'>
                <div className='text-gray-800 whitespace-pre-wrap leading-relaxed'>
                  {meeting.content}
                </div>
              </div>

              {/* 좋아요와 채팅방 버튼을 글 밑으로 이동 */}
              <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                <button
                  onClick={toggleLike}
                  className='flex items-center space-x-2 hover:scale-105 transition-transform'
                >
                  <Heart
                    className={`w-6 h-6 ${likeStatus.liked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                  />
                  <span
                    className={`text-lg ${likeStatus.liked ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    {likeStatus.likeCount}
                  </span>
                </button>

                {renderChatButton()}
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
                <MessageCircle className='w-5 h-5' />
                <span>댓글 {comments.length}개</span>
              </h2>

              {/* 댓글 작성 */}
              <div className='mb-6'>
                <div className='flex space-x-3'>
                  <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                    <User className='w-4 h-4 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <textarea
                      value={newComment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewComment(e.target.value)
                      }
                      placeholder='댓글을 작성해주세요...'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none'
                      rows={3}
                    />
                    <div className='flex justify-end mt-2'>
                      <button
                        onClick={addComment}
                        disabled={!newComment.trim()}
                        className='bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        댓글 작성
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className='space-y-4'>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className='border-b border-gray-100 pb-4 last:border-b-0'
                  >
                    <div className='flex space-x-3'>
                      <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                        <User className='w-4 h-4 text-gray-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-2 mb-1'>
                          <span className='font-medium text-gray-900'>
                            {comment.authorName}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.isMine && (
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className='text-xs text-gray-400 hover:text-red-500 transition-colors ml-2'
                            >
                              삭제
                            </button>
                          )}
                        </div>
                        <p className='text-gray-800 mb-2'>{comment.content}</p>
                        <div className='flex items-center space-x-4'>
                          <button
                            onClick={() => handleRepliesToggle(comment.id)}
                            className='text-sm text-slate-600 hover:text-slate-800'
                          >
                            {expandedComments.has(comment.id)
                              ? '답글 숨기기'
                              : '답글'}
                          </button>
                          <button
                            onClick={() => setReplyingTo(comment.id)}
                            className='text-sm text-slate-600 hover:text-slate-800'
                          >
                            답글 작성
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 답글 작성 */}
                    {replyingTo === comment.id && (
                      <div className='ml-11 mt-3'>
                        <div className='flex space-x-3'>
                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                            <User className='w-3 h-3 text-gray-600' />
                          </div>
                          <div className='flex-1'>
                            <textarea
                              value={replyContent}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>,
                              ) => setReplyContent(e.target.value)}
                              placeholder='답글을 작성해주세요...'
                              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none text-sm'
                              rows={2}
                            />
                            <div className='flex justify-end space-x-2 mt-2'>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                                className='text-sm text-gray-600 hover:text-gray-800'
                              >
                                취소
                              </button>
                              <button
                                onClick={() => addReply(comment.id)}
                                disabled={!replyContent.trim()}
                                className='bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
                              >
                                답글 작성
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 답글들 (확장된 경우에만 표시) */}
                    {expandedComments.has(comment.id) &&
                      comment.replies.length > 0 && (
                        <div className='ml-11 mt-3 space-y-3'>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className='flex space-x-3'>
                              <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                <User className='w-3 h-3 text-gray-600' />
                              </div>
                              <div className='flex-1'>
                                <div className='flex items-center space-x-2 mb-1'>
                                  <span className='font-medium text-gray-900 text-sm'>
                                    {reply.authorName}
                                  </span>
                                  <span className='text-xs text-gray-500'>
                                    {formatDate(reply.createdAt)}
                                  </span>
                                  {reply.isMine && (
                                    <button
                                      onClick={() =>
                                        deleteReply(comment.id, reply.id)
                                      }
                                      className='text-xs text-gray-400 hover:text-red-500 transition-colors ml-2'
                                    >
                                      삭제
                                    </button>
                                  )}
                                </div>
                                <p className='text-gray-800 text-sm'>
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* 더 보기 버튼 (무한스크롤) */}
              {hasMoreComments && (
                <div className='text-center mt-6'>
                  <button
                    onClick={loadMoreComments}
                    disabled={loadingComments}
                    className='bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors'
                  >
                    {loadingComments ? '로딩 중...' : '댓글 더 보기'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 채팅방 연결 모달 */}
      {showChatModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96'>
            <h3 className='text-lg font-semibold mb-4'>채팅방 연결하기</h3>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                연결할 채팅방을 선택하세요
              </label>
              <div className='relative'>
                <select
                  value={selectedChatRoom}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedChatRoom(e.target.value)
                  }
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none'
                >
                  <option value=''>채팅방을 선택하세요</option>
                  {chatRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.memberCount}명)
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
              </div>
            </div>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => {
                  setShowChatModal(false);
                  setSelectedChatRoom('');
                }}
                className='px-4 py-2 text-gray-600 hover:text-gray-800'
              >
                취소
              </button>
              <button
                onClick={linkChatRoom}
                disabled={!selectedChatRoom}
                className='bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                연결하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
