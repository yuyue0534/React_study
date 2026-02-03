import { useState } from 'react'
import { useUserStore } from '../stores/userStore'

export default function Customers() {
    const { users, addUser, updateUser, deleteUser } = useUserStore()

    const [visible, setVisible] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        name: '',
        contact: '',
        level: '普通'
    })

    const openAdd = () => {
        setEditing(null)
        setForm({ name: '', contact: '', level: '普通' })
        setVisible(true)
    }

    const openEdit = (user) => {
        setEditing(user)
        setForm(user)
        setVisible(true)
    }

    const handleSubmit = () => {
        if (!form.name) return alert('请输入客户名称')

        if (editing) {
            updateUser(editing.id, form)
        } else {
            addUser(form)
        }
        setVisible(false)
    }

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">客户管理</h1>
                <button
                    onClick={openAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                    + 新增客户
                </button>
            </div>

            {/* 表格 */}
            <table className="w-full bg-white rounded shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">客户名</th>
                        <th className="p-2 text-left">联系人</th>
                        <th className="p-2 text-left">等级</th>
                        <th className="p-2 text-left">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-t hover:bg-gray-100">
                            <td className="p-2">{u.name}</td>
                            <td className="p-2">{u.contact}</td>
                            <td className="p-2">{u.level}</td>
                            <td className="p-2 space-x-2">
                                <button
                                    className="text-blue-600 border rounded p-1 hover:bg-blue-200"
                                    onClick={() => openEdit(u)}
                                >
                                    编辑
                                </button>
                                <button
                                    className="text-red-600 border rounded p-1 hover:bg-red-200"
                                    onClick={() => deleteUser(u.id)}
                                >
                                    删除
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 弹框 */}
            {visible && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white w-96 p-6 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">
                            {editing ? '编辑客户' : '新增客户'}
                        </h2>

                        <div className="space-y-3">
                            <input
                                placeholder="客户名称"
                                className="w-full border p-2 rounded"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                placeholder="联系人"
                                className="w-full border p-2 rounded"
                                value={form.contact}
                                onChange={e => setForm({ ...form, contact: e.target.value })}
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={form.level}
                                onChange={e => setForm({ ...form, level: e.target.value })}
                            >
                                <option>普通</option>
                                <option>VIP</option>
                            </select>
                        </div>

                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setVisible(false)}
                                className="px-4 py-2 border rounded"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
