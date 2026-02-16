export default function MobileLayout({ children }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="relative w-[390px] h-[844px] bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-200">
        <div className="w-full h-full overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
