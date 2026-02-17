export default function MobileLayout({ children }) {
  return (
    <div className="sm:flex sm:justify-center sm:items-center sm:min-h-screen sm:bg-gray-200">
      <div className="relative w-full h-[100dvh] sm:w-[390px] sm:h-[844px] bg-white sm:rounded-[40px] overflow-hidden sm:shadow-2xl sm:border sm:border-gray-200 [transform:translateZ(0)]">
        <div className="w-full h-full overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
