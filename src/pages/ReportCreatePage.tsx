import React, { useState, useEffect } from 'react';
import { Search, Bell, User, ArrowLeft, Book, Tag, X, ChevronDown } from 'lucide-react';

// TypeScript 인터페이스 정의
interface BookResponse {
  bookId: number;
  isbn13: string;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  reputation: number;
  coverImage: string;
  description: string;
  categoryName: string;
  createdAt: string;
  viewCount: number;
}

interface TagResponse {
  id: number;
  name: string;
}

interface CreateReportRequest {
  title: string;
  content: string;
  bookId: number;
  tagIds: number[];
}

interface ReportDetailResponse {
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
  createdAt: string;
  updatedAt: string;
  likedByMe: boolean;
}

const ReportFormPage: React.FC = () => {
  // URL 파라미터로 수정 모드 구분 (실제로는 useParams 사용)
  const isEditMode = false; // 수정 모드면 true
  const reportId: number | null = null; // 수정할 독후감 ID
  
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  
  // 책 검색 관련 상태
  const [bookSearchKeyword, setBookSearchKeyword] = useState<string>('');
  const [bookSuggestions, setBookSuggestions] = useState<string[]>([]);
  const [showBookSuggestions, setShowBookSuggestions] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<BookResponse | null>(null);
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 테스트 태그 데이터
  const testTags: TagResponse[] = [
    { id: 1, name: "감동적" },
    { id: 2, name: "슬픔" },
    { id: 3, name: "기쁨" },
    { id: 4, name: "신비로운" },
    { id: 5, name: "긴장감" },
    { id: 6, name: "우쾌한" },
    { id: 7, name: "평화로운" },
    { id: 8, name: "철학적" },
    { id: 9, name: "유머러스" },
    { id: 10, name: "로맨틱" },
    { id: 11, name: "스릴러" },
    { id: 12, name: "판타지" }
  ];

  // 테스트 책 자동완성 데이터
  const testBookSuggestions: string[] = [
    "프로젝트 헤일메리",
    "데미안",
    "사피엔스",
    "노르웨이의 숲",
    "1984",
    "해리포터와 마법사의 돌",
    "반지의 제왕",
    "어린왕자"
  ];

  // 테스트 책 데이터
  const testBooks: { [key: string]: BookResponse } = {
    "프로젝트 헤일메리": {
      bookId: 1,
      isbn13: "9791164843527",
      title: "프로젝트 헤일메리",
      author: "앤디 위어",
      publisher: "웅진지식하우스",
      pubDate: "2021-05-20",
      reputation: 4.5,
      coverImage: "https://example.com/cover1.jpg",
      description: "태양이 어두워지고 있다. 인류를 구하기 위한 마지막 희망, 프로젝트 헤일메리가 시작된다.",
      categoryName: "SF소설",
      createdAt: "2024-01-01T00:00:00",
      viewCount: 1250
    },
    "데미안": {
      bookId: 2,
      isbn13: "9788932473901",
      title: "데미안",
      author: "헤르만 헤세",
      publisher: "민음사",
      pubDate: "2019-03-15",
      reputation: 4.3,
      coverImage: "https://example.com/cover2.jpg",
      description: "성장소설의 고전. 한 청년의 내적 성장과 자아 찾기의 여정을 그린 작품.",
      categoryName: "문학",
      createdAt: "2024-01-01T00:00:00",
      viewCount: 980
    },
    "사피엔스": {
      bookId: 3,
      isbn13: "9788934972464",
      title: "사피엔스",
      author: "유발 하라리",
      publisher: "김영사",
      pubDate: "2015-11-02",
      reputation: 4.7,
      coverImage: "https://example.com/cover3.jpg",
      description: "인류의 역사를 새로운 관점에서 조망한 역작. 인간은 어떻게 지구의 정복자가 되었는가?",
      categoryName: "역사/문화",
      createdAt: "2024-01-01T00:00:00",
      viewCount: 2100
    }
  };

  // 수정 모드일 때 기존 데이터
  const testReportData: ReportDetailResponse = {
    id: 1,
    title: "「프로젝트 헤일메리」 - 과학의 힘으로 극복하는 인간의 의지",
    content: `앤디 위어의 「프로젝트 헤일메리」를 읽고 나서 과학에 대한 새로운 시각을 갖게 되었습니다.

이 소설은 단순한 SF 소설이 아니라, 인간의 생존 의지와 과학적 사고의 힘을 보여주는 작품입니다. 주인공이 절망적인 상황에서도 포기하지 않고 문제를 해결해 나가는 과정이 매우 인상적이었습니다.

특히 과학적 방법론을 통해 하나씩 문제를 해결해 나가는 장면들이 현실에서도 우리가 어려움을 극복하는 방법과 다르지 않다는 생각이 들었습니다.

강력히 추천하는 작품입니다.`,
    viewCount: 245,
    likeCount: 38,
    bookId: 1,
    bookTitle: "프로젝트 헤일메리",
    bookAuthor: "앤디 위어",
    tags: ["신비로운", "긴장감", "희망적"],
    authorName: "SF매니아",
    createdAt: "2024-12-22T15:30:00",
    updatedAt: "2024-12-22T15:30:00",
    likedByMe: true
  };

  // API 함수들
  const fetchTags = async (): Promise<void> => {
    try {
      // 실제 API 호출
      // const response = await fetch('/api/tags');
      // const data: TagResponse[] = await response.json();
      
      // 테스트 데이터 사용
      setTags(testTags);
    } catch (error) {
      console.error('태그 조회 실패:', error);
    }
  };

  const fetchBookAutoComplete = async (keyword: string): Promise<void> => {
    if (!keyword.trim()) {
      setBookSuggestions([]);
      return;
    }

    try {
      // 실제 API 호출
      // const response = await fetch(`/api/books/autocomplete?keyword=${encodeURIComponent(keyword)}`);
      // const suggestions: string[] = await response.json();
      
      // 테스트 데이터 사용
      const filtered = testBookSuggestions.filter(book =>
        book.toLowerCase().includes(keyword.toLowerCase())
      );
      setBookSuggestions(filtered);
    } catch (error) {
      console.error('책 자동완성 조회 실패:', error);
    }
  };

  const fetchBookDetail = async (bookTitle: string): Promise<void> => {
    try {
      // 실제 API에서는 책 제목으로 책 ID를 찾은 후 상세 정보를 가져와야 함
      // 여기서는 테스트를 위해 제목으로 직접 매칭
      
      // 실제 API 호출 예시:
      // 1. 먼저 책 검색으로 bookId 찾기
      // 2. GET /api/books/{bookId}로 상세 정보 가져오기
      
      // 테스트 데이터 사용
      const book = testBooks[bookTitle];
      if (book) {
        setSelectedBook(book);
      }
    } catch (error) {
      console.error('책 상세 정보 조회 실패:', error);
    }
  };

  const fetchReportData = async (): Promise<void> => {
    if (!isEditMode || !reportId) return;
    
    try {
      // 실제 API 호출
      // const response = await fetch(`/api/reports/${reportId}`);
      // const data: ReportDetailResponse = await response.json();
      
      // 테스트 데이터 사용
      const data = testReportData;
      setFormData({
        title: data.title,
        content: data.content
      });
      
      // 기존 책 정보 설정
      const book = Object.values(testBooks).find(b => b.bookId === data.bookId);
      if (book) {
        setSelectedBook(book);
        setBookSearchKeyword(book.title);
      }
      
      // 기존 태그 설정
      const tagIds = testTags
        .filter(tag => data.tags.includes(tag.name))
        .map(tag => tag.id);
      setSelectedTagIds(tagIds);
    } catch (error) {
      console.error('독후감 데이터 조회 실패:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBookSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setBookSearchKeyword(value);
    
    if (value.trim()) {
      fetchBookAutoComplete(value);
      setShowBookSuggestions(true);
    } else {
      setShowBookSuggestions(false);
      setSelectedBook(null);
    }
    
    // 에러 초기화
    if (errors.book) {
      setErrors(prev => ({
        ...prev,
        book: ''
      }));
    }
  };

  const handleBookSelect = (bookTitle: string): void => {
    setBookSearchKeyword(bookTitle);
    setShowBookSuggestions(false);
    fetchBookDetail(bookTitle);
  };

  const handleTagToggle = (tagId: number): void => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
    
    // 에러 초기화
    if (errors.tags) {
      setErrors(prev => ({
        ...prev,
        tags: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }
    
    if (!selectedBook) {
      newErrors.book = '책을 선택해주세요.';
    }
    
    if (selectedTagIds.length === 0) {
      newErrors.tags = '최소 1개 이상의 태그를 선택해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const requestData: CreateReportRequest = {
        title: formData.title,
        content: formData.content,
        bookId: selectedBook!.bookId,
        tagIds: selectedTagIds
      };
      
      const url = isEditMode ? `/api/reports/${reportId}` : '/api/reports';
      const method = isEditMode ? 'PATCH' : 'POST';
      
      // 실제 API 호출
      // const token = localStorage.getItem('accessToken') || document.cookie
      //   .split('; ')
      //   .find(row => row.startsWith('accessToken='))
      //   ?.split('=')[1];
      
      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(requestData)
      // });
      
      // 테스트용 성공 처리
      setTimeout(() => {
        alert(isEditMode ? '독후감이 수정되었습니다!' : '독후감이 작성되었습니다!');
        window.history.back(); // 이전 페이지로 이동
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('독후감 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchReportData();
  }, []);

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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                {isEditMode ? '독후감 수정' : '새 독후감 작성'}
              </h1>

              <div onSubmit={handleSubmit} className="space-y-6">
                {/* 책 검색 및 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    책 선택 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={bookSearchKeyword}
                        onChange={handleBookSearchChange}
                        placeholder="책 제목을 검색하세요"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                          errors.book ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    
                    {/* 책 자동완성 드롭다운 */}
                    {showBookSuggestions && bookSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                        {bookSuggestions.map((book, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleBookSelect(book)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-3"
                          >
                            <Book className="w-4 h-4 text-gray-400" />
                            <span>{book}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.book && <p className="text-red-500 text-sm mt-1">{errors.book}</p>}
                  
                  {/* 선택된 책 정보 */}
                  {selectedBook && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-20 bg-gradient-to-b from-slate-300 to-slate-500 rounded flex items-center justify-center flex-shrink-0">
                          <Book className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{selectedBook.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{selectedBook.author} · {selectedBook.publisher}</p>
                          <p className="text-xs text-gray-500 mb-2">출간일: {selectedBook.pubDate}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{selectedBook.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBook(null);
                            setBookSearchKeyword('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="독후감 제목을 입력해주세요"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* 감정 태그 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    감정 태그 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">이 책을 읽고 느낀 감정이나 인상을 나타내는 태그를 선택해주세요.</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedTagIds.includes(tag.id)
                            ? 'bg-slate-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  {errors.tags && <p className="text-red-500 text-sm mt-2">{errors.tags}</p>}
                  
                  {/* 선택된 태그 표시 */}
                  {selectedTagIds.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">선택된 태그:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTagIds.map((tagId) => {
                          const tag = tags.find(t => t.id === tagId);
                          return tag ? (
                            <span
                              key={tagId}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700"
                            >
                              {tag.name}
                              <button
                                type="button"
                                onClick={() => handleTagToggle(tagId)}
                                className="ml-2 text-slate-500 hover:text-slate-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    독후감 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    placeholder="책을 읽고 느낀 점, 인상 깊었던 부분, 감상 등을 자유롭게 작성해주세요.&#10;&#10;예시:&#10;- 책의 주요 내용이나 메시지&#10;- 인상 깊었던 구절이나 장면&#10;- 개인적인 감상이나 생각&#10;- 다른 독자들에게 전하고 싶은 말"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none ${
                      errors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* 제출 버튼 */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>{isEditMode ? '수정하기' : '독후감 작성'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportFormPage;