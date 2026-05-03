import Calculator from './components/Calculator'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="text-center pt-10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">TongTong</h1>
        <p className="text-sm text-gray-500 mt-1">Split your ride costs fairly</p>
      </header>
      <Calculator />
    </div>
  )
}
