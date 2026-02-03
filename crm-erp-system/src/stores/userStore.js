import { create } from 'zustand'

export const useUserStore = create((set) => ({
    users: [
        {
            id: crypto.randomUUID(),
            name: '阿里巴巴',
            contact: '张三',
            level: 'VIP'
        },
        {
            id: crypto.randomUUID(),
            name: '腾讯',
            contact: '李四',
            level: '普通'
        }
    ],

    addUser: (user) =>
        set((state) => ({
            users: [...state.users, { ...user, id: crypto.randomUUID() }]
        })),

    updateUser: (id, data) =>
        set((state) => ({
            users: state.users.map(u =>
                u.id === id ? { ...u, ...data } : u
            )
        })),

    deleteUser: (id) =>
        set((state) => ({
            users: state.users.filter(u => u.id !== id)
        }))
}))
