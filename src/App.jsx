import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">
          TailwindCSS Test 성공 🎉
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          이 문구가 예쁘게 보인다면 Tailwind가 정상 적용된 것입니다!
        </p>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          확인 버튼
        </button>
      </div>
    </div>
  )
}

export default App
