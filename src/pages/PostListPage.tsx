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
  BookOutlined,
} from '@ant-design/icons';
import { Input, Select, Button, Tabs, Card, Tag, Avatar, Pagination, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Envs } from '@/utils/env';
import { defaultFetch } from '@/apis';
import styles from './PostListPage.module.css';

const { Search } = Input;
const { Option } = Select;

// TypeScript 인터페이스 정의 (백엔드 DTO 기반)
interface ReportSummaryResponse {
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

interface MeetingSummaryResponse {
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
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

type PostType = 'reports' | 'meetings';
type SortType = 'latest' | 'views' | 'likes';

// API 함수들
const fetchReports = async (page: number, sortType: SortType, keyword?: string): Promise<PageResponse<ReportSummaryResponse>> => {
  let url: string;
  
  if (keyword?.trim()) {
    url = `${Envs.VITE_API_ENDPOINT}/api/reports/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=10`;
  } else {
    url = `${Envs.VITE_API_ENDPOINT}/api/reports?page=${page}&size=10&sortType=${sortType}`;
  }
  
  const response = await defaultFetch(url, { method: 'GET' });
  return response.json();
};

const fetchMeetings = async (page: number, sortType: SortType, keyword?: string): Promise<PageResponse<MeetingSummaryResponse>> => {
  let url: string;
  
  if (keyword?.trim()) {
    url = `${Envs.VITE_API_ENDPOINT}/api/meetings/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=10`;
  } else {
    url = `${Envs.VITE_API_ENDPOINT}/api/meetings?page=${page}&size=10&sortType=${sortType}`;
  }
  
  const response = await defaultFetch(url, { method: 'GET' });
  return response.json();
};

const fetchAutoComplete = async (endpoint: string, keyword: string): Promise<string[]> => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/${endpoint}/autocomplete?keyword=${encodeURIComponent(keyword)}`;
  const response = await defaultFetch(url, { method: 'GET' });
  return response.json();
};

const togglePostLike = async (postId: number): Promise<void> => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/posts/${postId}/like`;
  await defaultFetch(url, { method: 'POST' });
};

export const PostListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PostType>('meetings');
  const [reports, setReports] = useState<ReportSummaryResponse[]>([]);
  const [meetings, setMeetings] = useState<MeetingSummaryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // 데이터 로드 함수
  const loadPosts = async (page: number = 0, sort: SortType = 'latest', keyword: string = ''): Promise<void> => {
    setLoading(true);
    
    try {
      if (activeTab === 'reports') {
        const data = await fetchReports(page, sort, keyword);
        setReports(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        const data = await fetchMeetings(page, sort, keyword);
        setMeetings(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
      setCurrentPage(page + 1); // 백엔드는 0-based, UI는 1-based
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      // 에러 시 빈 데이터로 설정
      if (activeTab === 'reports') {
        setReports([]);
      } else {
        setMeetings([]);
      }
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // 자동완성 로드
  const loadAutoComplete = async (keyword: string): Promise<void> => {
    if (!keyword.trim()) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const endpoint = activeTab === 'reports' ? 'reports' : 'meetings';
      const suggestions = await fetchAutoComplete(endpoint, keyword);
      setSearchSuggestions(suggestions || []);
    } catch (error) {
      console.error('자동완성 조회 실패:', error);
      setSearchSuggestions([]);
    }
  };

  // 좋아요 토글
  const handleToggleLike = async (postId: number): Promise<void> => {
    try {
      await togglePostLike(postId);
      
      // UI 업데이트
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
  const handleTabChange = (key: string): void => {
    const tab = key as PostType;
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchKeyword('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = (value: string): void => {
    setSearchKeyword(value);
    loadPosts(0, sortType, value);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    
    if (value.trim()) {
      loadAutoComplete(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion: string): void => {
    setSearchKeyword(suggestion);
    setShowSuggestions(false);
    loadPosts(0, sortType, suggestion);
  };

  const handleSortChange = (value: SortType): void => {
    setSortType(value);
    loadPosts(currentPage - 1, value, searchKeyword);
  };

  const handlePageChange = (page: number): void => {
    loadPosts(page - 1, sortType, searchKeyword);
  };

  const handlePostClick = (post: ReportSummaryResponse | MeetingSummaryResponse): void => {
    if (activeTab === 'reports') {
      navigate(`/posts/reports/${post.id}`);
    } else {
      navigate(`/posts/meetings/${post.id}`);
    }
  };

  const handleCreateClick = (): void => {
    if (activeTab === 'reports') {
      navigate('/posts/reports/create');
    } else {
      navigate('/posts/meetings/create');
    }
  };

  // 유틸리티 함수들
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getMeetingTypeColor = (type: string): string => {
    switch (type) {
      case 'ONLINE': return 'blue';
      case 'OFFLINE': return 'green';
      case 'HYBRID': return 'purple';
      default: return 'default';
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
    loadPosts();
  }, [activeTab]);

  const tabItems = [
    {
      key: 'reports',
      label: '독후감',
    },
    {
      key: 'meetings',
      label: '독서모임',
    },
  ];

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
              <div className={`${styles.bookCover} ${styles.bookCoverLiterature}`}>
                <span>문학</span>
              </div>
              <div className={styles.bookInfo}>
                <div className={styles.bookTitle}>데미안</div>
                <div className={styles.bookAuthor}>헤르만 헤세</div>
              </div>
            </div>
            
            <div className={styles.bookItem}>
              <div className={`${styles.bookCover} ${styles.bookCoverPsychology}`}>
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
            {/* 좌측: AI 검색과 기본 선택 버튼들 */}
            <div className={styles.headerLeft}>
              <Button type="primary" icon={<SearchOutlined />} className={styles.aiSearchButton}>
                AI 검색
              </Button>
              <Button type="text">기본 선택</Button>
            </div>
            
            {/* 중앙: 검색바 */}
            <div className={styles.searchContainer}>
              <Search
                placeholder="검색어를 입력하세요"
                onSearch={handleSearch}
                onChange={handleSearchInputChange}
                value={searchKeyword}
                size="large"
              />
              
              {/* 자동완성 드롭다운 */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={styles.autocompleteItem}
                    >
                      <SearchOutlined className={styles.autocompleteIcon} />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 우측: 관리자 페이지, 로그아웃, 알림, 프로필 */}
            <div className={styles.headerRight}>
              <span className={styles.headerLink}>관리자 페이지</span>
              <span className={styles.headerLink}>로그아웃</span>
              <Button type="text" icon={<BellOutlined />} />
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className={styles.main}>
          {/* 탭과 헤더 */}
          <div className={styles.tabHeader}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              size="large"
            />
            
            <div className={styles.tabControls}>
              {/* 정렬 선택 */}
              <Select
                value={sortType}
                onChange={handleSortChange}
                style={{ width: 120 }}
              >
                <Option value="latest">최신순</Option>
                <Option value="views">조회수순</Option>
                <Option value="likes">좋아요순</Option>
              </Select>
              
              <Button type="primary" className={styles.createButton} onClick={handleCreateClick}>
                {activeTab === 'reports' ? '독후감 작성' : '모임 만들기'}
              </Button>
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className={styles.postList}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
              </div>
            ) : (activeTab === 'reports' ? reports : meetings).length === 0 ? (
              <Empty description={activeTab === 'reports' ? '독후감이 없습니다.' : '모임이 없습니다.'} />
            ) : (
              (activeTab === 'reports' ? reports : meetings).map((post) => (
                <Card 
                  key={post.id} 
                  hoverable 
                  className={styles.postCard}
                  onClick={() => handlePostClick(post)}
                >
                  <div className={styles.postContent}>
                    <div className={styles.postMain}>
                      {/* 제목과 타입 */}
                      <div className={styles.postTitle}>
                        <h3 className={styles.postTitleText}>
                          {post.title}
                        </h3>
                        {activeTab === 'meetings' && (
                          <Tag color={getMeetingTypeColor((post as MeetingSummaryResponse).meetingType)}>
                            {getMeetingTypeText((post as MeetingSummaryResponse).meetingType)}
                          </Tag>
                        )}
                      </div>

                      {/* 게시글 정보 */}
                      <div className={styles.postInfo}>
                        <div className={styles.infoItem}>
                          <UserOutlined />
                          <span>{activeTab === 'reports' ? (post as ReportSummaryResponse).authorName : (post as MeetingSummaryResponse).hostName}</span>
                        </div>
                        
                        {activeTab === 'reports' && (post as ReportSummaryResponse).bookTitle && (
                          <div className={styles.infoItem}>
                            <BookOutlined />
                            <span>{(post as ReportSummaryResponse).bookTitle} - {(post as ReportSummaryResponse).bookAuthor}</span>
                          </div>
                        )}
                        
                        {activeTab === 'meetings' && (
                          <>
                            <div className={styles.infoItem}>
                              <CalendarOutlined />
                              <span>{formatDate((post as MeetingSummaryResponse).startAt)}</span>
                            </div>
                            <div className={styles.infoItem}>
                              <TeamOutlined />
                              <span>{(post as MeetingSummaryResponse).currentParticipants}/{(post as MeetingSummaryResponse).capacity}명</span>
                            </div>
                          </>
                        )}
                        
                        {activeTab === 'reports' && (
                          <div className={styles.infoItem}>
                            <CalendarOutlined />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        )}
                        
                        <div className={styles.infoItem}>
                          <EyeOutlined />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>

                      {/* 태그들 */}
                      {post.tags && post.tags.length > 0 && (
                        <div className={styles.tagList}>
                          {post.tags.map((tag, index) => (
                            <Tag key={index} color="default">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 좋아요 */}
                    <Button
                      type="text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(post.id);
                      }}
                      className={styles.likeButton}
                      icon={post.likedByMe ? <HeartFilled className={styles.likeIconFilled} /> : <HeartOutlined />}
                    >
                      <span className={post.likedByMe ? styles.likeCountFilled : styles.likeCount}>
                        {post.likeCount}
                      </span>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={currentPage}
                total={totalElements}
                pageSize={10}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}개`}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};