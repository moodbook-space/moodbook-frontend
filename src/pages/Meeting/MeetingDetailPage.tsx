// @ts-ignore
// @ts-nocheck
// @ts-ignore
import React, { useState, useEffect } from 'react';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  Button,
  Input,
  Card,
  Tag,
  Avatar,
  Spin,
  Empty,
  Modal,
  Select,
  message,
} from 'antd';
import { useParams, useNavigate } from 'react-router';
import { Envs } from '@/utils/env';
import { defaultFetch } from '@/apis';
import styles from './MeetingDetailPage.module.css';

const { TextArea } = Input;
const { Option } = Select;

// TypeScript 인터페이스 정의 (백엔드 DTO 기반)
interface MeetingDetailResponse {
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

interface LikeStatusResponse {
  likeCount: number;
  liked: boolean;
}

interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

interface ChatLinkRequest {
  chatRoomId: number;
}

// API 함수들
const fetchMeetingDetail = async (id: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/meetings/${id}`;
  return defaultFetch(url, { method: 'GET' });
};

const fetchLikeStatus = async (postId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/posts/${postId}/like`;
  return defaultFetch(url, { method: 'GET' });
};

const toggleLike = async (postId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/posts/${postId}/like`;
  return defaultFetch(url, { method: 'POST' });
};

const fetchComments = async (
  postId: number,
  page: number = 0,
  size: number = 10,
) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/posts/${postId}/comments?page=${page}&size=${size}`;
  return defaultFetch(url, { method: 'GET' });
};

const fetchReplies = async (postId: number, parentCommentId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/posts/${postId}/comments/${parentCommentId}/replies`;
  return defaultFetch(url, { method: 'GET' });
};

const createComment = async (postId: number, data: CreateCommentRequest) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/posts/${postId}/comments`;
  return defaultFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const deleteComment = async (postId: number, commentId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/posts/${postId}/comments/${commentId}`;
  return defaultFetch(url, { method: 'DELETE' });
};

const linkChatRoom = async (meetingId: number, data: ChatLinkRequest) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/meetings/${meetingId}/chat-link`;
  return defaultFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const deleteMeeting = async (meetingId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/meetings/${meetingId}`;
  return defaultFetch(url, { method: 'DELETE' });
};

export const MeetingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const meetingId = id ? parseInt(id) : null;

  const [meeting, setMeeting] = useState<MeetingDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeStatus, setLikeStatus] = useState<LikeStatusResponse>({
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
  const [currentUser] = useState({ id: 1, name: '현재사용자' }); // 실제로는 인증에서 가져옴

  // 채팅방 관련 상태
  const [chatRooms] = useState<ChatRoom[]>([
    { id: 1, name: 'SF 소설 토론방', memberCount: 15 },
    { id: 2, name: '북클럽 메인', memberCount: 25 },
    { id: 3, name: '독서 모임', memberCount: 8 },
  ]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<string>('');
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [isChatMember, setIsChatMember] = useState<boolean>(false);

  // 데이터 로드 함수들
  const loadMeetingDetail = async (): Promise<void> => {
    if (!meetingId) return;

    setLoading(true);
    try {
      const data = await fetchMeetingDetail(meetingId);
      setMeeting(data);

      // 좋아요 상태 로드
      const likeData = await fetchLikeStatus(meetingId);
      setLikeStatus(likeData);
    } catch (error) {
      console.error('모임 상세 조회 실패:', error);
      message.error('모임 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (page: number = 0): Promise<void> => {
    if (!meetingId) return;

    if (page === 0) setLoadingComments(true);

    try {
      const data: any = await fetchComments(meetingId, page, 10);

      if (page === 0) {
        setComments(data);
      } else {
        setComments((prev) => [...prev, ...data]);
      }
      setCommentsPage(page);
      setHasMoreComments(data.length === 10); // 10개 미만이면 더 이상 없음
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      message.error('댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoadingComments(false);
    }
  };

  const loadReplies = async (parentCommentId: number): Promise<void> => {
    if (!meetingId) return;

    try {
      const replies = await fetchReplies(meetingId, parentCommentId);

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
      message.error('답글을 불러오는데 실패했습니다.');
    }
  };

  // 이벤트 핸들러들
  const handleToggleLike = async (): Promise<void> => {
    if (!meetingId) return;

    try {
      await toggleLike(meetingId);
      setLikeStatus((prev) => ({
        likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1,
        liked: !prev.liked,
      }));
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      message.error('좋아요 처리에 실패했습니다.');
    }
  };

  const handleAddComment = async (): Promise<void> => {
    if (!meetingId || !newComment.trim()) return;

    try {
      const commentId = await createComment(meetingId, { content: newComment });

      const newCommentObj: CommentResponse = {
        id: commentId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: newComment,
        createdAt: new Date().toISOString(),
        isMine: true,
        replies: [],
      };

      setComments((prev) => [...prev, newCommentObj]);
      setNewComment('');
      message.success('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      message.error('댓글 작성에 실패했습니다.');
    }
  };

  const handleAddReply = async (parentCommentId: number): Promise<void> => {
    if (!meetingId || !replyContent.trim()) return;

    try {
      const replyId = await createComment(meetingId, {
        content: replyContent,
        parentCommentId,
      });

      const newReply: CommentResponse = {
        id: replyId,
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
      message.success('답글이 작성되었습니다.');
    } catch (error) {
      console.error('답글 작성 실패:', error);
      message.error('답글 작성에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number): Promise<void> => {
    if (!meetingId) return;

    try {
      await deleteComment(meetingId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      message.success('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      message.error('댓글 삭제에 실패했습니다.');
    }
  };

  const handleDeleteReply = async (
    commentId: number,
    replyId: number,
  ): Promise<void> => {
    if (!meetingId) return;

    try {
      await deleteComment(meetingId, replyId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
            : c,
        ),
      );
      message.success('답글이 삭제되었습니다.');
    } catch (error) {
      console.error('답글 삭제 실패:', error);
      message.error('답글 삭제에 실패했습니다.');
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
      loadReplies(commentId);
    }
  };

  const handleLinkChatRoom = async (): Promise<void> => {
    if (!meetingId || !selectedChatRoom) return;

    try {
      await linkChatRoom(meetingId, { chatRoomId: parseInt(selectedChatRoom) });
      setMeeting((prev) =>
        prev ? { ...prev, chatRoomId: parseInt(selectedChatRoom) } : null,
      );
      setShowChatModal(false);
      setSelectedChatRoom('');
      message.success('채팅방이 연결되었습니다.');
    } catch (error) {
      console.error('채팅방 연결 실패:', error);
      message.error('채팅방 연결에 실패했습니다.');
    }
  };

  const handleJoinChatRoom = (): void => {
    setIsChatMember(true);
    message.success('채팅방에 참여했습니다.');
  };

  const handleEnterChatRoom = (): void => {
    if (meeting?.chatRoomId) {
      // 실제로는 채팅 페이지로 이동
      navigate(`/chat-rooms/${meeting.chatRoomId}`);
    }
  };

  const handleEditMeeting = (): void => {
    if (meetingId) {
      navigate(`/posts/meetings/edit/${meetingId}`);
    }
  };

  const handleDeleteMeeting = async (): Promise<void> => {
    if (!meetingId) return;

    Modal.confirm({
      title: '모임 삭제',
      content: '정말로 이 모임을 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMeeting(meetingId);
          message.success('모임이 삭제되었습니다.');
          navigate('/posts');
        } catch (error) {
          console.error('모임 삭제 실패:', error);
          message.error('모임 삭제에 실패했습니다.');
        }
      },
    });
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  const loadMoreComments = (): void => {
    if (!loadingComments && hasMoreComments) {
      loadComments(commentsPage + 1);
    }
  };

  // 유틸리티 함수들
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getMeetingTypeColor = (type: string): string => {
    switch (type) {
      case 'ONLINE':
        return 'blue';
      case 'OFFLINE':
        return 'green';
      case 'HYBRID':
        return 'purple';
      default:
        return 'default';
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
        <Button
          onClick={() => setShowChatModal(true)}
          className={styles.chatButton}
        >
          채팅방 연결하기
        </Button>
      );
    }

    if (meeting.chatRoomId !== null) {
      if (!isChatMember) {
        return (
          <Button
            onClick={handleJoinChatRoom}
            className={styles.joinChatButton}
          >
            채팅방 참여하기
          </Button>
        );
      } else {
        return (
          <Button
            onClick={handleEnterChatRoom}
            className={styles.enterChatButton}
          >
            채팅방 입장하기
          </Button>
        );
      }
    }

    return null;
  };

  useEffect(() => {
    loadMeetingDetail();
    loadComments();
  }, [meetingId]);

  // 채팅방 가입 상태 확인
  useEffect(() => {
    if (meeting && meeting.chatRoomId) {
      setIsChatMember(false);
    }
  }, [meeting]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size='large' />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className={styles.errorContainer}>
        <Empty description='모임을 찾을 수 없습니다.' />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 사이드바 */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span>📚</span>
            </div>
            <span className={styles.logoText}>MoodBook</span>
          </div>
        </div>

        <div className={styles.sidebarContent}>
          <h3 className={styles.sidebarTitle}>Recently Readed</h3>
          <div className={styles.bookList}>
            <div className={styles.bookItem}>
              <div className={`${styles.bookCover} ${styles.bookCoverSf}`}>
                <span>SF</span>
              </div>
              <div className={styles.bookInfo}>
                <div className={styles.bookTitle}>프로젝트 헤일메리</div>
                <div className={styles.bookAuthor}>앤디 위어</div>
              </div>
            </div>

            <div className={styles.bookItem}>
              <div
                className={`${styles.bookCover} ${styles.bookCoverLiterature}`}
              >
                <span>문학</span>
              </div>
              <div className={styles.bookInfo}>
                <div className={styles.bookTitle}>데미안</div>
                <div className={styles.bookAuthor}>헤르만 헤세</div>
              </div>
            </div>

            <div className={styles.bookItem}>
              <div
                className={`${styles.bookCover} ${styles.bookCoverPsychology}`}
              >
                <span>심리</span>
              </div>
              <div className={styles.bookInfo}>
                <div className={styles.bookTitle}>사피엔스</div>
                <div className={styles.bookAuthor}>유발 하라리</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        {/* 상단바 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <Button
                type='primary'
                icon={<SearchOutlined />}
                className={styles.aiSearchButton}
              >
                AI 검색
              </Button>
              <Button type='text'>기본 선택</Button>
            </div>

            <div className={styles.searchContainer}>
              <Input
                placeholder='검색어를 입력하세요'
                prefix={<SearchOutlined />}
                size='large'
              />
            </div>

            <div className={styles.headerRight}>
              <span className={styles.headerLink}>관리자 페이지</span>
              <span className={styles.headerLink}>로그아웃</span>
              <Button type='text' icon={<BellOutlined />} />
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className={styles.main}>
          <Button
            type='text'
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className={styles.backButton}
          >
            목록으로 돌아가기
          </Button>

          <div className={styles.contentContainer}>
            {/* 모임 정보 카드 */}
            <Card className={styles.meetingCard}>
              <div className={styles.meetingHeader}>
                <div className={styles.meetingTitleSection}>
                  <h1 className={styles.meetingTitle}>{meeting.title}</h1>
                  <div className={styles.meetingMeta}>
                    <Tag color={getMeetingTypeColor(meeting.meetingType)}>
                      {getMeetingTypeText(meeting.meetingType)}
                    </Tag>
                    <div className={styles.viewCount}>
                      <EyeOutlined />
                      <span>{meeting.viewCount}</span>
                    </div>
                  </div>
                </div>

                {/* 게시글 수정/삭제 버튼 (호스트만) */}
                {currentUser.id === meeting.hostId && (
                  <div className={styles.meetingActions}>
                    <Button type='text' onClick={handleEditMeeting}>
                      수정
                    </Button>
                    <Button
                      type='text'
                      onClick={handleDeleteMeeting}
                      className={styles.deleteButton}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>

              <div className={styles.meetingInfo}>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <UserOutlined />
                    <span>{meeting.hostName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <CalendarOutlined />
                    <span>
                      {formatDate(meeting.startAt)} -{' '}
                      {formatDate(meeting.endAt)}
                    </span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <TeamOutlined />
                    <span>
                      {meeting.currentParticipants}/{meeting.capacity}명
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <EnvironmentOutlined />
                    <span>{meeting.location}</span>
                  </div>
                </div>
              </div>

              {meeting.tags && meeting.tags.length > 0 && (
                <div className={styles.tagList}>
                  {meeting.tags.map((tag, index) => (
                    <Tag key={index} color='default'>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}

              <div className={styles.meetingContent}>
                <div className={styles.contentText}>{meeting.content}</div>
              </div>

              {/* 좋아요와 채팅방 버튼 */}
              <div className={styles.meetingFooter}>
                <Button
                  type='text'
                  onClick={handleToggleLike}
                  className={styles.likeButton}
                  icon={
                    likeStatus.liked ? (
                      <HeartFilled className={styles.likeIconFilled} />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                >
                  <span
                    className={
                      likeStatus.liked
                        ? styles.likeCountFilled
                        : styles.likeCount
                    }
                  >
                    {likeStatus.likeCount}
                  </span>
                </Button>

                {renderChatButton()}
              </div>
            </Card>

            {/* 댓글 섹션 */}
            <Card className={styles.commentsCard}>
              <h2 className={styles.commentsTitle}>
                {'<MessageCircleOutlined />'}
                <span>댓글 {comments.length}개</span>
              </h2>

              {/* 댓글 작성 */}
              <div className={styles.commentForm}>
                <div className={styles.commentFormContent}>
                  <Avatar
                    icon={<UserOutlined />}
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentInputContainer}>
                    <TextArea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder='댓글을 작성해주세요...'
                      rows={3}
                      className={styles.commentInput}
                    />
                    <div className={styles.commentSubmit}>
                      <Button
                        type='primary'
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className={styles.commentSubmitButton}
                      >
                        댓글 작성
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className={styles.commentsList}>
                {comments.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentMain}>
                      <Avatar
                        icon={<UserOutlined />}
                        className={styles.commentAvatar}
                      />
                      <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>
                            {comment.authorName}
                          </span>
                          <span className={styles.commentDate}>
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.isMine && (
                            <Button
                              type='text'
                              size='small'
                              onClick={() => handleDeleteComment(comment.id)}
                              className={styles.deleteCommentButton}
                            >
                              삭제
                            </Button>
                          )}
                        </div>
                        <p className={styles.commentText}>{comment.content}</p>
                        <div className={styles.commentActions}>
                          <Button
                            type='text'
                            size='small'
                            onClick={() => handleRepliesToggle(comment.id)}
                          >
                            {expandedComments.has(comment.id)
                              ? '답글 숨기기'
                              : '답글'}
                          </Button>
                          <Button
                            type='text'
                            size='small'
                            onClick={() => setReplyingTo(comment.id)}
                          >
                            답글 작성
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 답글 작성 */}
                    {replyingTo === comment.id && (
                      <div className={styles.replyForm}>
                        <Avatar icon={<UserOutlined />} size='small' />
                        <div className={styles.replyInputContainer}>
                          <TextArea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder='답글을 작성해주세요...'
                            rows={2}
                            className={styles.replyInput}
                          />
                          <div className={styles.replyActions}>
                            <Button
                              size='small'
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                            >
                              취소
                            </Button>
                            <Button
                              type='primary'
                              size='small'
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyContent.trim()}
                            >
                              답글 작성
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 답글들 */}
                    {expandedComments.has(comment.id) &&
                      comment.replies.length > 0 && (
                        <div className={styles.repliesList}>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className={styles.replyItem}>
                              <Avatar icon={<UserOutlined />} size='small' />
                              <div className={styles.replyContent}>
                                <div className={styles.replyHeader}>
                                  <span className={styles.replyAuthor}>
                                    {reply.authorName}
                                  </span>
                                  <span className={styles.replyDate}>
                                    {formatDate(reply.createdAt)}
                                  </span>
                                  {reply.isMine && (
                                    <Button
                                      type='text'
                                      size='small'
                                      onClick={() =>
                                        handleDeleteReply(comment.id, reply.id)
                                      }
                                      className={styles.deleteReplyButton}
                                    >
                                      삭제
                                    </Button>
                                  )}
                                </div>
                                <p className={styles.replyText}>
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

              {/* 더 보기 버튼 */}
              {hasMoreComments && (
                <div className={styles.loadMoreContainer}>
                  <Button
                    onClick={loadMoreComments}
                    loading={loadingComments}
                    className={styles.loadMoreButton}
                  >
                    {loadingComments ? '로딩 중...' : '댓글 더 보기'}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* 채팅방 연결 모달 */}
      <Modal
        title='채팅방 연결하기'
        open={showChatModal}
        onOk={handleLinkChatRoom}
        onCancel={() => {
          setShowChatModal(false);
          setSelectedChatRoom('');
        }}
        okText='연결하기'
        cancelText='취소'
        okButtonProps={{ disabled: !selectedChatRoom }}
      >
        <div className={styles.chatModalContent}>
          <p>연결할 채팅방을 선택하세요</p>
          <Select
            value={selectedChatRoom}
            onChange={setSelectedChatRoom}
            placeholder='채팅방을 선택하세요'
            style={{ width: '100%' }}
            size='large'
          >
            {chatRooms.map((room) => (
              <Option key={room.id} value={room.id.toString()}>
                {room.name} ({room.memberCount}명)
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};
