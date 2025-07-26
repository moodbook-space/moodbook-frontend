import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Heart, Eye, Calendar, Book, MessageCircle, ArrowLeft, MoreVertical } from 'lucide-react';

// TypeScript 인터페이스 정의
interface ReportDetail {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  tags: string[];
  authorName: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  likedByMe: boolean;
}

interface BookInfo {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  coverImage: string;
  description: string;
  categoryName: string;
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

interface LikeStatus {
  likeCount: number;
  liked: boolean;
}

const ReportDetailPage: React.FC = () => {
  // URL에서 독후감 ID 가져오기 (실제로는 useParams 사용)
  const reportId = 1;
  
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({ likeCount: 0, liked: false });
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [commentsPage, setCommentsPage] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [currentUser] = useState({ id: 1, name: '현재사용자' }); // 실제로는 인증에서 가져옴

  // 테스트 데이터
  const testReport: ReportDetail = {
    id: 1,
    title: "「프로젝트 헤일메리」 - 과학의 힘으로 극복하는 인간의 의지",
    content: `앤디 위어의 「프로젝트 헤일메리」를 읽고 나서 과학에 대한 새로운 시각을 갖게 되었습니다.

이 소설은 단순한 SF 소설이 아니라, 인간의 생존 의지와 과학적 사고의 힘을 보여주는 작품입니다. 주인공이 절망적인 상황에서도 포기하지 않고 문제를 해결해 나가는 과정이 매우 인상적이었습니다.

특히 과학적 방법론을 통해 하나씩 문제를 해결해 나가는 장면들이 현실에서도 우리가 어려움을 극복하는 방법과 다르지 않다는 생각이 들었습니다. 작가는 복잡한 과학 이론을 일반인도 이해할 수 있게 쉽게 풀어내면서도, 그 과정에서 인간의 따뜻함과 유머를 잃지 않았습니다.

로키와의 우정은 이 소설의 백미입니다. 서로 다른 종족이지만 같은 목표를 향해 협력하는 모습에서 진정한 우정이 무엇인지 다시 한번 생각해보게 되었습니다.

과학을 좋아하는 분들뿐만 아니라, 희망과 용기가 필요한 모든 분들께 강력히 추천하는 작품입니다.`,
    viewCount: 245,
    likeCount: 38,
    bookId: 1,
    bookTitle: "프로젝트 헤일메리",
    bookAuthor: "앤디 위어",
    tags: ["신비로운", "긴장감", "희망적"],
    authorName: "SF매니아",
    authorId: 2,
    createdAt: "2024-12-22T15:30:00",
    updatedAt: "2024-12-22T15:30:00",
    likedByMe: true
  };

  const testBookInfo: BookInfo = {
    bookId: 1,
    title: "프로젝트 헤일메리",
    author: "앤디 위어",
    publisher: "웅진지식하우스",
    pubDate: "2021-05-20",
    coverImage: "https://example.com/cover1.jpg",
    description: "태양이 어두워지고 있다. 인류를 구하기 위한 마지막 희망, 프로젝트 헤일메리가 시작된다.",
    categoryName: "SF소설"
  };

  const testComments: CommentResponse[] = [
    {
      id: 1,
      authorId: 3,
      authorName: "책벌레",
      content: "정말 좋은 독후감이네요! 저도 이 책 읽어보고 싶어졌어요.",
      createdAt: "2024-12-22T16:00:00",
      isMine: false,
      replies: []
    },
    {
      id: 2,
      authorId: 1,
      authorName: "현재사용자",
      content: "로키와의 우정 부분이 정말 감동적이었죠. 작가가 외계인과의 소통을 정말 잘 그려낸 것 같아요.",
      createdAt: "2024-12-22T17:30:00",
      isMine: true,
      replies: []
    },
    {
      id: 3,
      authorId: 4,
      authorName: "과학덕후",
      content: "과학적 방법론에 대한 해석이 인상적이네요. 저는 물리학 전공인데, 작가가 과학을 정말 정확하게 이해하고 있다고 느꼈어요.",
      createdAt: "2024-12-22T18:15:00",
      isMine: false,
      replies: []
    }
  ];

  // API 함수들
  const fetchReportDetail = async (): Promise<void> => {
    setLoading(true);
    try {
      // 실제 API 호출
      // const token = getAuthToken();
      // const response = await fetch(`/api/reports/${reportId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data: ReportDetail = await response.json();
      
      // 테스트 데이터 사용
      setTimeout(() => {
        setReport(testReport);
        setBookInfo(testBookInfo);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('독후감 상세 조회 실패:', error);
      setLoading(false);
    }
  };

  const fetchLikeStatus = async (): Promise<void> => {
    try {
      // 실제 API 호출
      // const response = await fetch(`/api/posts/${reportId}/like`);
      // const data: LikeStatus = await response.json();
      
      // 테스트 데이터
      setLikeStatus({
        likeCount: testReport.likeCount,
        liked: testReport.likedByMe
      });
    } catch (error) {
      console.error('좋아요 상태 조회 실패:', error);
    }
  };

  const fetchComments = async (page: number = 0): Promise<void> => {
    if (page === 0) setLoadingComments(true);
    
    try {
      // 실제 API 호출
      // const response = await fetch(`/api/posts/${reportId}/comments?page=${page}&size=10`);
      // const data: CommentResponse[] = await response.json();
      
      // 테스트 데이터
      setTimeout(() => {
        if (page === 0) {
          setComments(testComments);
        } else {
          // 무한스크롤 시 추가 데이터 로드
          setComments(prev => [...prev, ...testComments]);
        }
        setCommentsPage(page);
        setHasMoreComments(false); // 테스트에서는 더 이상 댓글 없음
        setLoadingComments(false);
      }, 300);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      setLoadingComments(false);
    }
  };

  const fetchReplies = async (parentCommentId: number): Promise<void> => {
    try {
      // 실제 API 호출
      // const response = await fetch(`/api/posts/${reportId}/comments/${parentCommentId}/replies`);
      // const replies: CommentResponse[] = await response.json();
      
      // 테스트 답글 데이터
      const testReplies: CommentResponse[] = [
        {
          id: 10 + parentCommentId,
          authorId: 2,
          authorName: "SF매니아",
          content: "감사합니다! 정말 추천하고 싶은 책이에요.",
          createdAt: "2024-12-22T16:30:00",
          isMine: false,
          replies: []
        },
        {
          id: 20 + parentCommentId,
          authorId: 1,
          authorName: "현재사용자",
          content: "저도 같은 생각이에요. 특히 과학적 사고 부분이 인상깊었어요.",
          createdAt: "2024-12-22T17:00:00",
          isMine: true,
          replies: []
        }
      ];
      
      // 답글을 해당 댓글에 추가
      setComments(prev => prev.map(comment => 
        comment.id === parentCommentId 
          ? { ...comment, replies: testReplies }
          : comment
      ));
      
      // 해당 댓글을 확장 상태로 표시
      setExpandedComments(prev => new Set([...prev, parentCommentId]));
    } catch (error) {
      console.error('답글 조회 실패:', error);
    }
  };

  const toggleLike = async (): Promise<void> => {
    try {
      // 실제 API 호출
      // await fetch(`/api/posts/${reportId}/like`, { method: 'POST' });
      
      // 테스트 업데이트
      setLikeStatus(prev => ({
        likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1,
        liked: !prev.liked
      }));
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  const addComment = async (): Promise<void> => {
    if (!newComment.trim()) return;
    
    try {
      // 실제 API 호출
      // const response = await fetch(`/api/posts/${reportId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newComment })
      // });
      
      // 테스트 데이터 추가
      const newCommentObj: CommentResponse = {
        id: Date.now(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: newComment,
        createdAt: new Date().toISOString(),
        isMine: true,
        replies: []
      };
      
      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const addReply = async (parentCommentId: number): Promise<void> => {
    if (!replyContent.trim()) return;
    
    try {
      // 실제 API 호출
      // const response = await fetch(`/api/posts/${reportId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: replyContent, parentCommentId })
      // });
      
      // 테스트 데이터 추가
      const newReply: CommentResponse = {
        id: Date.now(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: replyContent,
        createdAt: new Date().toISOString(),
        isMine: true,
        replies: []
      };
      
      setComments(prev => prev.map(comment => 
        comment.id === parentCommentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ));
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('답글 작성 실패:', error);
    }
  };

  const deleteComment = async (commentId: number): Promise<void> => {
    try {
      // 실제 API 호출
      // await fetch(`/api/posts/${reportId}/comments/${commentId}`, { method: 'DELETE' });
      
      // 테스트 삭제
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const deleteReply = async (commentId: number, replyId: number): Promise<void> => {
    try {
      // 실제 API 호출
      // await fetch(`/api/posts/${reportId}/comments/${replyId}`, { method: 'DELETE' });
      
      // 테스트 삭제
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, replies: c.replies.filter(r => r.id !== replyId) }
          : c
      ));
    } catch (error) {
      console.error('답글 삭제 실패:', error);
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
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [] }
          : comment
      ));
    } else {
      // 답글 불러오기
      fetchReplies(commentId);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchReportDetail();
    fetchLikeStatus();
    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">독후감을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📚</span>
            </div>
            <span className="text-xl font-semibold text-slate-700">MoodBook</span>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Recently Readed</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">SF</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">프로젝트 헤일메리</div>
                <div className="text-xs text-gray-500">앤디 위어</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">문학</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">데미안</div>
                <div className="text-xs text-gray-500">헤르만 헤세</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-16 bg-gradient-to-b from-purple-400 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">심리</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">사피엔스</div>
                <div className="text-xs text-gray-500">유발 하라리</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 상단바 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-slate-700 transition-colors">
                <Search className="w-4 h-4" />
                <span>AI 검색</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                기본 선택
              </button>
            </div>
            
            <div className="flex-1 max-w-xl mx-8 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">관리자 페이지</span>
              <span className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">로그아웃</span>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>목록으로 돌아가기</span>
          </button>

          <div className="max-w-4xl mx-auto">
            {/* 독후감 정보 카드 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{report.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{report.viewCount}</span>
                    </div>
                  </div>
                </div>
                
                {/* 게시글 수정/삭제 버튼 (본인만) */}
                {currentUser.id === report.authorId && (
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-blue-600 px-3 py-1 rounded transition-colors">
                      수정
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('정말 삭제하시겠습니까?')) {
                          alert('독후감이 삭제되었습니다.');
                          window.history.back();
                        }
                      }}
                      className="text-gray-600 hover:text-red-600 px-3 py-1 rounded transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 책 정보 */}
              {bookInfo && (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">읽은 책</h3>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-20 bg-gradient-to-b from-slate-300 to-slate-500 rounded flex items-center justify-center flex-shrink-0">
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{bookInfo.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{bookInfo.author} · {bookInfo.publisher}</p>
                      <p className="text-xs text-gray-500 mb-2">출간일: {bookInfo.pubDate} · 분야: {bookInfo.categoryName}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{bookInfo.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 태그들 */}
              {report.tags && report.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {report.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 독후감 내용 */}
              <div className="prose max-w-none mb-6">
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {report.content}
                </div>
              </div>

              {/* 좋아요 */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={toggleLike}
                  className="flex items-center space-x-2 hover:scale-105 transition-transform"
                >
                  <Heart 
                    className={`w-6 h-6 ${likeStatus.liked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`} 
                  />
                  <span className={`text-lg ${likeStatus.liked ? 'text-red-500' : 'text-gray-600'}`}>
                    {likeStatus.likeCount}
                  </span>
                </button>
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>댓글 {comments.length}개</span>
              </h2>

              {/* 댓글 작성 */}
              <div className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 작성해주세요..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={addComment}
                        disabled={!newComment.trim()}
                        className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        댓글 작성
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    {/* 최상위 댓글 */}
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.authorName}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                          {comment.isMine && (
                            <button 
                              onClick={() => deleteComment(comment.id)}
                              className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                        <p className="text-gray-800 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleRepliesToggle(comment.id)}
                            className="text-sm text-slate-600 hover:text-slate-800"
                          >
                            {expandedComments.has(comment.id) ? '답글 숨기기' : '답글'}
                          </button>
                          <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-sm text-slate-600 hover:text-slate-800"
                          >
                            답글 작성
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 답글 작성 */}
                    {replyingTo === comment.id && (
                      <div className="ml-11 mt-3">
                        <div className="flex space-x-3">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="답글을 작성해주세요..."
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none text-sm"
                              rows={2}
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                                className="text-sm text-gray-600 hover:text-gray-800"
                              >
                                취소
                              </button>
                              <button
                                onClick={() => addReply(comment.id)}
                                disabled={!replyContent.trim()}
                                className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                답글 작성
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 답글들 (확장된 경우에만 표시) */}
                    {expandedComments.has(comment.id) && comment.replies.length > 0 && (
                      <div className="ml-11 mt-3 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900 text-sm">{reply.authorName}</span>
                                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                {reply.isMine && (
                                  <button 
                                    onClick={() => deleteReply(comment.id, reply.id)}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2"
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-800 text-sm">{reply.content}</p>
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
                <div className="text-center mt-6">
                  <button
                    onClick={loadMoreComments}
                    disabled={loadingComments}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    {loadingComments ? '로딩 중...' : '댓글 더 보기'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportDetailPage;