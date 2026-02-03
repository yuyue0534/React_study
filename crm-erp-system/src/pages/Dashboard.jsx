export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">仪表盘</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">今日订单：23</div>
        <div className="bg-white p-4 rounded shadow">本月销售额：¥98,000</div>
        <div className="bg-white p-4 rounded shadow">库存预警：3</div>
      </div>
    </div>
  )
}
