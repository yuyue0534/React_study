import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/common/Button';
import { Plus, Search, Filter, MoreHorizontal, FileDown } from 'lucide-react';
import { saveAs } from 'file-saver';

// 模拟 API 调用
const fetchCustomers = async () => {
  // 实际开发中调用 axios
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        name: `企业客户 ${i + 1} 有限公司`,
        contact: `张经理 ${i + 1}`,
        phone: `1380013800${i}`,
        status: i % 3 === 0 ? '成交' : '潜在',
        sales: `销售员 A`,
        updatedAt: '2023-10-24'
      })));
    }, 500);
  });
};

const CustomerList = () => {
  const [search, setSearch] = useState('');
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const handleExport = () => {
    const csvContent = "ID,名称,联系人,状态\n" + 
      customers.map(c => `${c.id},${c.name},${c.contact},${c.status}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "customers.csv");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* 工具栏 */}
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-900">客户列表</h2>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索客户名称..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={handleExport}><FileDown className="w-4 h-4 mr-2"/>导出</Button>
          <Button><Plus className="w-4 h-4 mr-2"/>新建客户</Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">客户名称</th>
              <th className="px-6 py-4">主要联系人</th>
              <th className="px-6 py-4">联系电话</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4">负责人</th>
              <th className="px-6 py-4">最后跟进</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
               <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">加载数据中...</td></tr>
            ) : (
              customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.contact}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{customer.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${customer.status === '成交' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.sales}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{customer.updatedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-primary-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* 分页 */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-500">共 124 条记录</span>
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-1 text-xs" disabled>上一页</Button>
          <Button variant="secondary" className="px-3 py-1 text-xs">下一页</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;