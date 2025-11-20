import React from 'react';
import { Folder, FileText, Download, Search, MoreHorizontal, FileCode, FileImage } from 'lucide-react';

const Resources: React.FC = () => {
  const folders = [
    { id: 1, name: 'Physics Notes', items: 12, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 2, name: 'CS Assignments', items: 8, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, name: 'Calculus References', items: 24, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 4, name: 'Exam Papers', items: 5, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  const files = [
    { id: 1, name: 'Electromagnetism_Ch4.pdf', size: '2.4 MB', date: 'Today', type: 'pdf' },
    { id: 2, name: 'React_Basics_Cheatsheet.png', size: '1.1 MB', date: 'Yesterday', type: 'img' },
    { id: 3, name: 'Lab_Report_Template.docx', size: '500 KB', date: 'Oct 20', type: 'doc' },
    { id: 4, name: 'main_algorithm.py', size: '4 KB', date: 'Oct 18', type: 'code' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'code': return <FileCode className="text-green-500" />;
      case 'img': return <FileImage className="text-purple-500" />;
      default: return <FileText className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Resources</h2>
           <p className="text-gray-500">Access and manage your learning materials.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
                type="text" 
                placeholder="Search files..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
        </div>
      </div>

      {/* Folders Grid */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {folders.map(folder => (
                <div key={folder.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-3 rounded-xl ${folder.bg}`}>
                            <Folder className={folder.color} size={24} />
                        </div>
                        <button className="text-gray-300 group-hover:text-gray-500"><MoreHorizontal size={16} /></button>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm truncate">{folder.name}</h4>
                    <p className="text-xs text-gray-500">{folder.items} items</p>
                </div>
            ))}
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Recent Uploads</h3>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
              {files.map(file => (
                  <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition group">
                      <div className="flex items-center gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                              {getIcon(file.type)}
                          </div>
                          <div>
                              <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
                          </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition">
                          <Download size={18} />
                      </button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Resources;