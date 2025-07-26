import React, { useState, useEffect } from 'react';
import { Search, Bell, User, ArrowLeft, X } from 'lucide-react';
import { Envs } from '@/utils/env';
import { defaultFetch } from '@/apis';

// TypeScript 인터페이스 정의
interface TagResponse {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  content: string;
  meetingType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  startAt: string;
  endAt: string;
  capacity: number;
  location: string;
}

interface CreateMeetingRequest {
  title: string;
  content: string;
  meetingType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  startAt: string;
  endAt: string;
  capacity: number;
  location: string;
  tagIds: number[];
}

interface MeetingDetailForEdit {
  title: string;
  content: string;
  meetingType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  startAt: string;
  endAt: string;
  capacity: number;
  location: string;
  tagIds: number[];
}

export const MeetingCreatePage: React.FC = () => {
  // URL 파라미터로 수정 모드 구분 (실제로는 useParams 사용)
  const isEditMode = false; // 수정 모드면 true
  const meetingId: number | null = null; // 수정할 모임 ID

  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // 폼 데이터
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    meetingType: 'ONLINE',
    startAt: '',
    endAt: '',
    capacity: 10,
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // API 함수들
  const fetchTags = async (): Promise<void> => {
    try {
      const response = await defaultFetch('/api/tags', { method: 'GET' });
      const data: TagResponse[] = await response.json();

      setTags(data);
    } catch (error) {
      console.error('태그 조회 실패:', error);
    }
  };

  const fetchMeetingData = async (): Promise<void> => {
    if (!isEditMode || !meetingId) return;

    try {
      // 실제 API 호출
      const response = await defaultFetch(`/api/meetings/${meetingId}`, {
        method: 'GET',
      });
      const data: MeetingDetailForEdit = await response.json();

      setFormData(data);
      setSelectedTagIds(data.tagIds);
    } catch (error) {
      console.error('모임 데이터 조회 실패:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 초기화
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTagToggle = (tagId: number): void => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });

    // 에러 초기화
    if (errors.tags) {
      setErrors((prev) => ({
        ...prev,
        tags: '',
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

    if (!formData.startAt) {
      newErrors.startAt = '시작 일시를 선택해주세요.';
    }

    if (!formData.endAt) {
      newErrors.endAt = '종료 일시를 선택해주세요.';
    }

    if (
      formData.startAt &&
      formData.endAt &&
      new Date(formData.startAt) >= new Date(formData.endAt)
    ) {
      newErrors.endAt = '종료 일시는 시작 일시보다 늦어야 합니다.';
    }

    if (formData.capacity < 2) {
      newErrors.capacity = '최소 2명 이상이어야 합니다.';
    }

    if (formData.capacity > 100) {
      newErrors.capacity = '최대 100명까지 가능합니다.';
    }

    if (
      (formData.meetingType === 'OFFLINE' ||
        formData.meetingType === 'HYBRID') &&
      !formData.location.trim()
    ) {
      newErrors.location = '오프라인 모임의 경우 장소를 입력해주세요.';
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
      const requestData: CreateMeetingRequest = {
        ...formData,
        tagIds: selectedTagIds,
      };

      const url = isEditMode
        ? `${Envs.VITE_API_ENDPOINT}/api/meetings/${meetingId}`
        : '/api/meetings';
      const method = isEditMode ? 'PATCH' : 'POST';

      await defaultFetch(url, {
        method,
        body: JSON.stringify(requestData),
      });

      alert(isEditMode ? '모임이 수정되었습니다!' : '모임이 생성되었습니다!');
      window.history.back(); // 이전 페이지로 이동
      setLoading(false);
    } catch (error) {
      console.error('모임 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchTags();
    fetchMeetingData();
  }, []);

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
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
              <h1 className='text-2xl font-bold text-gray-900 mb-8'>
                {isEditMode ? '독서모임 수정' : '새 독서모임 만들기'}
              </h1>

              <div className='space-y-6'>
                {/* 제목 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    제목 <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder='모임 제목을 입력해주세요'
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && (
                    <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
                  )}
                </div>

                {/* 모임 타입 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    모임 타입 <span className='text-red-500'>*</span>
                  </label>
                  <div className='flex space-x-4'>
                    {(['ONLINE', 'OFFLINE', 'HYBRID'] as const).map((type) => (
                      <label key={type} className='flex items-center'>
                        <input
                          type='radio'
                          name='meetingType'
                          value={type}
                          checked={formData.meetingType === type}
                          onChange={handleInputChange}
                          className='mr-2'
                        />
                        <span className='text-gray-700'>
                          {getMeetingTypeText(type)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 일시 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      시작 일시 <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='datetime-local'
                      name='startAt'
                      value={formData.startAt}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                        errors.startAt ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.startAt && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.startAt}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      종료 일시 <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='datetime-local'
                      name='endAt'
                      value={formData.endAt}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                        errors.endAt ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endAt && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.endAt}
                      </p>
                    )}
                  </div>
                </div>

                {/* 인원수와 장소 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      모집 인원 <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      name='capacity'
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min={2}
                      max={100}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                        errors.capacity ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.capacity && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.capacity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      장소{' '}
                      {(formData.meetingType === 'OFFLINE' ||
                        formData.meetingType === 'HYBRID') && (
                        <span className='text-red-500'>*</span>
                      )}
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder={
                        formData.meetingType === 'ONLINE'
                          ? '온라인 링크나 플랫폼명'
                          : '모임 장소를 입력해주세요'
                      }
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.location && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* 감정 태그 선택 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    감정 태그 <span className='text-red-500'>*</span>
                  </label>
                  <p className='text-sm text-gray-500 mb-3'>
                    이 모임의 분위기나 느낌을 나타내는 태그를 선택해주세요.
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type='button'
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
                  {errors.tags && (
                    <p className='text-red-500 text-sm mt-2'>{errors.tags}</p>
                  )}

                  {/* 선택된 태그 표시 */}
                  {selectedTagIds.length > 0 && (
                    <div className='mt-3'>
                      <p className='text-sm text-gray-600 mb-2'>선택된 태그:</p>
                      <div className='flex flex-wrap gap-2'>
                        {selectedTagIds.map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId);
                          return tag ? (
                            <span
                              key={tagId}
                              className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700'
                            >
                              {tag.name}
                              <button
                                type='button'
                                onClick={() => handleTagToggle(tagId)}
                                className='ml-2 text-slate-500 hover:text-slate-700'
                              >
                                <X className='w-3 h-3' />
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
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    모임 소개 <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    name='content'
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={8}
                    placeholder='모임에 대한 자세한 소개를 작성해주세요.&#10;&#10;예시:&#10;- 어떤 책을 읽을 예정인지&#10;- 모임 진행 방식&#10;- 참여 대상이나 조건&#10;- 기타 안내사항'
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none ${
                      errors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.content && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.content}
                    </p>
                  )}
                </div>

                {/* 제출 버튼 */}
                <div className='flex justify-end space-x-4 pt-6 border-t border-gray-200'>
                  <button
                    type='button'
                    onClick={() => window.history.back()}
                    className='px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors'
                  >
                    취소
                  </button>
                  <button
                    type='button'
                    onClick={handleSubmit}
                    disabled={loading}
                    className='bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2'
                  >
                    {loading && (
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    )}
                    <span>{isEditMode ? '수정하기' : '모임 만들기'}</span>
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
