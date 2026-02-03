export default function Customers() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">客户管理</h1>
            <table className="w-full bg-white rounded shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">客户名</th>
                        <th className="p-2 text-left">联系人</th>
                        <th className="p-2 text-left">等级</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t">
                        <td className="p-2">阿里巴巴</td>
                        <td className="p-2">张三</td>
                        <td className="p-2">VIP</td>
                    </tr>
                    <tr className="border-t">
                        <td className="p-2">腾讯</td>
                        <td className="p-2">李四</td>
                        <td className="p-2">普通</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
