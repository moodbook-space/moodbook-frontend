import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Heart, Eye, Calendar, Users, Book, MapPin, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// TypeScript 인터페이스 정의
interface ReportSummary {
  id: number;
  title: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
  likedByMe: boolean;
  bookTitle?: string;
  bookAuthor?: string;
}

interface MeetingSummary {
  id: number;
  title: string;
  hostName: string;
  meetingType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  startAt: string;
  currentParticipants: number;
  capacity: number;
  viewCount: number;
  likeCount: number;
  tags: string[];
  createdAt: string;
  likedByMe: boolean;
  chatRoomId: number | null;
}

interface PageResponse<T> {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
}

type PostType = 'reports' | 'meetings';
type SortType = 'latest' | 'views' | 'likes';

const PostListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PostType>('meetings');
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [meetings, setMeetings] = useState<MeetingSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(3);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // 테스트 독후감 데이터
  const testReports: ReportSummary[] = [
    {
      id: 1,
      title: "「프로젝트 헤일메리」 - 과학의 힘으로 극복하는 인간의 의지",
      authorName: "SF매니아",
      createdAt: "2024-12-22T15:30:00",
      viewCount: 245,
      likeCount: 38,
      tags: ["신비로운", "긴장감", "희망적"],
      likedByMe: true,
      bookTitle: "프로젝트 헤일메리",
      bookAuthor: "앤디 위어"
    },
    {
      id: 2,
      title: "데미안을 읽고 나서... 성장이란 무엇인가",
      authorName: "문학소녀",
      createdAt: "2024-12-21T19:45:00",
      viewCount: 189,
      likeCount: 25,
      tags: ["철학적", "성장", "깊이있는"],
      likedByMe: false,
      bookTitle: "데미안",
      bookAuthor: "헤르만 헤세"
    },
    {
      id: 3,
      title: "사피엔스가 말하는 인류의 진화와 미래",
      authorName: "역사덕후",
      createdAt: "2024-12-20T14:20:00",
      viewCount: 312,
      likeCount: 42,
      tags: ["학술적", "통찰력", "흥미진진"],
      likedByMe: true,
      bookTitle: "사피엔스",
      bookAuthor: "유발 하라리"
    }
  ];

  // 테스트 독서모임 데이터
  const testMeetings: MeetingSummary[] = [
    {
      id: 1,
      title: "SF 소설 함께 읽어요! - 「프로젝트 헤일메리」",
      hostName: "SF매니아",
      meetingType: "ONLINE",
      startAt: "2024-12-25T19:00:00",
      currentParticipants: 8,
      capacity: 10,
      viewCount: 320,
      likeCount: 42,
      tags: ["신비로운", "긴장감", "우쾌한"],
      createdAt: "2024-12-20T10:00:00",
      likedByMe: true,
      chatRoomId: null
    },
    {
      id: 2,
      title: "클래식 문학 모임 - 「데미안」 깊이 읽기",
      hostName: "문학소녀",
      meetingType: "OFFLINE",
      startAt: "2024-12-28T14:00:00",
      currentParticipants: 5,
      capacity: 8,
      viewCount: 156,
      likeCount: 23,
      tags: ["철학적", "성장", "감동적"],
      createdAt: "2024-12-19T16:30:00",
      likedByMe: false,
      chatRoomId: null
    },
    {
      id: 3,
      title: "베스트셀러 읽기 모임 - 매주 토요일",
      hostName: "독서왕",
      meetingType: "HYBRID",
      startAt: "2024-12-30T10:00:00",
      currentParticipants: 12,
      capacity: 20,
      viewCount: 445,
      likeCount: 67,
      tags: ["다양한", "활발한", "즐거운"],
      createdAt: "2024-12-18T09:15:00",
      likedByMe: true,
      chatRoomId: null
    }
  ];

  const testReportSuggestions: string[] = [
    "프로젝트 헤일메리",
    "데미안", 
    "사피엔스",
    "노르웨이의 숲",
    "1984"
  ];

  const testMeetingSuggestions: string[] = [
    "SF 소설",
    "클래식 문학",
    "베스트셀러",
    "심리학",
    "추리소설"
  ];

  // API 호출 함수들
  const fetchPosts = async (page: number = 0, sort: SortType = 'latest', keyword: string = ''): Promise<void> => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken') || document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      let url: string;
      const endpoint = activeTab === 'reports' ? 'reports' : 'meetings';
      
      if (keyword.trim()) {
        url = `/api/${endpoint}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=10`;
      } else {
        url = `/api/${endpoint}?page=${page}&size=10&sortType=${sort}`;
      }

      // 실제 API 호출 (주석 처리)
      // const response = await fetch(url, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // if (response.ok) {
      //   const data: PageResponse<ReportSummary | MeetingSummary> = await response.json();
      //   if (activeTab === 'reports') {
      //     setReports(data.content as ReportSummary[]);
      //   } else {
      //     setMeetings(data.content as MeetingSummary[]);
      //   }
      //   setTotalPages(data.totalPages || 0);
      //   setCurrentPage(data.number || 0);
      // }

      // 테스트 데이터 사용
      setTimeout(() => {
        if (activeTab === 'reports') {
          let filteredReports = [...testReports];
          
          // 검색 필터링
          if (keyword.trim()) {
            filteredReports = filteredReports.filter(report =>
              report.title.toLowerCase().includes(keyword.toLowerCase()) ||
              report.authorName.toLowerCase().includes(keyword.toLowerCase()) ||
              (report.bookTitle && report.bookTitle.toLowerCase().includes(keyword.toLowerCase())) ||
              (report.bookAuthor && report.bookAuthor.toLowerCase().includes(keyword.toLowerCase()))
            );
          }
          
          // 정렬
          switch (sort) {
            case 'views':
              filteredReports.sort((a, b) => b.viewCount - a.viewCount);
              break;
            case 'likes':
              filteredReports.sort((a, b) => b.likeCount - a.likeCount);
              break;
            case 'latest':
            default:
              filteredReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              break;
          }
          
          // 페이지네이션
          const itemsPerPage = 3;
          const startIndex = page * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const pageData = filteredReports.slice(startIndex, endIndex);
          
          setReports(pageData);
          setTotalPages(Math.ceil(filteredReports.length / itemsPerPage));
        } else {
          let filteredMeetings = [...testMeetings];
          
          // 검색 필터링
          if (keyword.trim()) {
            filteredMeetings = filteredMeetings.filter(meeting =>
              meeting.title.toLowerCase().includes(keyword.toLowerCase()) ||
              meeting.hostName.toLowerCase().includes(keyword.toLowerCase())
            );
          }
          
          // 정렬
          switch (sort) {
            case 'views':
              filteredMeetings.sort((a, b) => b.viewCount - a.viewCount);
              break;
            case 'likes':
              filteredMeetings.sort((a, b) => b.likeCount - a.likeCount);
              break;
            case 'latest':
            default:
              filteredMeetings.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
              break;
          }
          
          // 페이지네이션
          const itemsPerPage = 3;
          const startIndex = page * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const pageData = filteredMeetings.slice(startIndex, endIndex);
          
          setMeetings(pageData);
          setTotalPages(Math.ceil(filteredMeetings.length / itemsPerPage));
        }
        
        setCurrentPage(page);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      setLoading(false);
    }
  };

  const fetchAutoComplete = async (keyword: string): Promise<void> => {
    if (!keyword.trim()) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const endpoint = activeTab === 'reports' ? 'reports' : 'meetings';
      
      // 실제 API 호출 (주석 처리)
      // const response = await fetch(`/api/${endpoint}/autocomplete?keyword=${encodeURIComponent(keyword)}`);
      // if (response.ok) {
      //   const suggestions: string[] = await response.json();
      //   setSearchSuggestions(suggestions || []);
      // }

      // 테스트 데이터 사용
      const suggestions = activeTab === 'reports' ? testReportSuggestions : testMeetingSuggestions;
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchSuggestions(filtered);
    } catch (error) {
      console.error('자동완성 조회 실패:', error);
    }
  };

  const toggleLike = async (postId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken') || document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      // 실제 API 호출 (주석 처리)
      // const response = await fetch(`/api/posts/${postId}/like`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // 테스트 업데이트
      if (activeTab === 'reports') {
        setReports(prev => prev.map(report => 
          report.id === postId 
            ? { 
                ...report, 
                likedByMe: !report.likedByMe,
                likeCount: report.likedByMe ? report.likeCount - 1 : report.likeCount + 1
              }
            : report
        ));
      } else {
        setMeetings(prev => prev.map(meeting => 
          meeting.id === postId 
            ? { 
                ...meeting, 
                likedByMe: !meeting.likedByMe,
                likeCount: meeting.likedByMe ? meeting.likeCount - 1 : meeting.likeCount + 1
              }
            : meeting
        ));
      }
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  // 이벤트 핸들러들
  const handleTabChange = (tab: PostType): void => {
    setActiveTab(tab);
    setCurrentPage(0);
    setSearchKeyword('');
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    fetchPosts(0, sortType, searchKeyword);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    
    if (value.trim()) {
      fetchAutoComplete(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string): void => {
    setSearchKeyword(suggestion);
    setShowSuggestions(false);
    fetchPosts(0, sortType, suggestion);
  };

  const handleSortChange = (newSort: SortType): void => {
    setSortType(newSort);
    fetchPosts(currentPage, newSort, searchKeyword);
  };

  const handlePageChange = (page: number): void => {
    fetchPosts(page, sortType, searchKeyword);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getMeetingTypeColor = (type: string): string => {
    switch (type) {
      case 'ONLINE': return 'bg-blue-100 text-blue-800';
      case 'OFFLINE': return 'bg-green-100 text-green-800';
      case 'HYBRID': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeText = (type: string): string => {
    switch (type) {
      case 'ONLINE': return '온라인';
      case 'OFFLINE': return '오프라인';
      case 'HYBRID': return '하이브리드';
      default: return type;
    }
  };

  // 탭 변경시 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

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
            {/* 좌측: AI 검색과 기본 선택 버튼들 */}
            <div className="flex items-center space-x-4">
              <button className="bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-slate-700 transition-colors">
                <Search className="w-4 h-4" />
                <span>AI 검색</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                기본 선택
              </button>
            </div>
            
            {/* 중앙: 검색바 */}
            <div className="flex-1 max-w-xl mx-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={handleSearchInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="검색어를 입력하세요"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              
              {/* 자동완성 드롭다운 */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* 우측: 관리자 페이지, 로그아웃, 알림, 프로필 */}
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
          {/* 탭 네비게이션 */}
          <div className="flex space-x-8 mb-6">
            <button
              onClick={() => handleTabChange('reports')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-slate-600 text-slate-700 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              독후감
            </button>
            <button
              onClick={() => handleTabChange('meetings')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'meetings'
                  ? 'border-slate-600 text-slate-700 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              독서모임
            </button>
          </div>

          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeTab === 'reports' ? '독후감 게시판' : '독서모임 게시판'}
            </h1>
            <div className="flex items-center space-x-4">
              {/* 정렬 드롭다운 */}
              <div className="relative">
                <select
                  value={sortType}
                  onChange={(e) => handleSortChange(e.target.value as SortType)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="latest">최신순</option>
                  <option value="views">조회수순</option>
                  <option value="likes">좋아요순</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <button className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                {activeTab === 'reports' ? '독후감 작성' : '모임 만들기'}
              </button>
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
              </div>
            ) : (activeTab === 'reports' ? reports : meetings).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {activeTab === 'reports' ? '독후감이 없습니다.' : '모임이 없습니다.'}
              </div>
            ) : (
              (activeTab === 'reports' ? reports : meetings).map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* 제목과 타입 */}
                      <div className="flex items-start space-x-3 mb-3">
                        <h3 className="text-lg font-medium text-gray-900 flex-1 hover:text-slate-600 transition-colors">
                          {post.title}
                        </h3>
                        {activeTab === 'meetings' && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMeetingTypeColor((post as MeetingSummary).meetingType)}`}>
                            {getMeetingTypeText((post as MeetingSummary).meetingType)}
                          </span>
                        )}
                      </div>

                      {/* 게시글 정보 */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{activeTab === 'reports' ? (post as ReportSummary).authorName : (post as MeetingSummary).hostName}</span>
                        </div>
                        
                        {activeTab === 'reports' && (post as ReportSummary).bookTitle && (post as ReportSummary).bookAuthor && (
                          <div className="flex items-center space-x-1">
                            <Book className="w-4 h-4" />
                            <span>{(post as ReportSummary).bookTitle} - {(post as ReportSummary).bookAuthor}</span>
                          </div>
                        )}
                        
                        {activeTab === 'meetings' && (
                          <>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate((post as MeetingSummary).startAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{(post as MeetingSummary).currentParticipants}/{(post as MeetingSummary).capacity}명</span>
                            </div>
                          </>
                        )}
                        
                        {activeTab === 'reports' && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>

                      {/* 태그들 */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 좋아요 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(post.id);
                      }}
                      className="flex items-center space-x-1 ml-4 hover:scale-105 transition-transform"
                    >
                      <Heart 
                        className={`w-5 h-5 ${post.likedByMe ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`} 
                      />
                      <span className={`text-sm ${post.likedByMe ? 'text-red-500' : 'text-gray-600'}`}>
                        {post.likeCount}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === i
                      ? 'bg-slate-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PostListPage;