import React, { useState } from 'react';
import { MapPin, Phone, Mail, Calendar, Globe, Shield, Clock, Building2, Search } from 'lucide-react';
import { UserProfile } from '../types';

interface SchoolInfoProps {
    user: UserProfile;
}

const CONTACTS = [
  { dept: 'Registrar Office', phone: '+254 700 123 456', email: 'registrar@su.edu' },
  { dept: 'Student Finance', phone: '+254 700 123 457', email: 'finance@su.edu' },
  { dept: 'IT Support', phone: '+254 700 123 458', email: 'support@su.edu' },
  { dept: 'Campus Security', phone: '+254 700 911 911', email: 'security@su.edu', highlight: true },
  { dept: 'Admissions', phone: '+254 700 123 459', email: 'admissions@su.edu' },
  { dept: 'Library Services', phone: '+254 700 123 460', email: 'library@su.edu' },
  { dept: 'Health Unit', phone: '+254 700 123 461', email: 'health@su.edu' },
  { dept: 'Dean of Students', phone: '+254 700 123 462', email: 'deanstudents@su.edu' },
  { dept: 'Careers Office', phone: '+254 700 123 463', email: 'careers@su.edu' },
];

const SchoolInfo: React.FC<SchoolInfoProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = CONTACTS.filter(c => 
    c.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
         <div className="bg-primary/10 p-6 rounded-full">
            <Building2 size={48} className="text-primary" />
         </div>
         <div>
            <h2 className="text-3xl font-bold text-gray-900">{user.schoolName}</h2>
            <p className="text-gray-500 mt-2 max-w-xl">Empowering the next generation of innovators and leaders through excellence in education, research, and service.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm font-medium text-gray-600">
               <span className="flex items-center gap-1"><MapPin size={16}/> Nairobi, Kenya</span>
               <span className="flex items-center gap-1"><Globe size={16}/> www.suconnect.edu</span>
               <span className="flex items-center gap-1"><Shield size={16}/> Accredited</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Contact Directory */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-[520px]">
            <div className="flex flex-col gap-4 mb-4 border-b border-gray-100 pb-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Directory</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{filteredContacts.length} found</span>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                        type="text" 
                        placeholder="Search department or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    />
                </div>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
               {filteredContacts.length > 0 ? (
                   filteredContacts.map((c, i) => (
                      <div key={i} className={`flex justify-between items-start p-3 rounded-lg transition-colors ${c.highlight ? 'bg-red-50 border border-red-100' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}>
                         <div>
                            <p className={`font-bold text-sm ${c.highlight ? 'text-red-700' : 'text-gray-800'}`}>{c.dept}</p>
                            <div className="flex flex-col gap-1 mt-1">
                                <span className="text-xs text-gray-500 flex items-center gap-2"><Phone size={12}/> {c.phone}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-2"><Mail size={12}/> {c.email}</span>
                            </div>
                         </div>
                         {c.highlight && <Shield size={16} className="text-red-500" />}
                      </div>
                   ))
               ) : (
                   <div className="text-center py-10 text-gray-400">
                       <Search size={32} className="mx-auto mb-2 opacity-50" />
                       <p className="text-sm">No contacts found.</p>
                   </div>
               )}
            </div>
         </div>

         {/* Academic Calendar & Hours */}
         <div className="space-y-6">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2">Academic Calendar</h3>
                <div className="space-y-3">
                   <div className="flex gap-4 items-center">
                      <div className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-center min-w-[60px]">
                         <span className="block text-xs font-bold uppercase">Oct</span>
                         <span className="block text-xl font-bold">25</span>
                      </div>
                      <div>
                         <p className="font-bold text-gray-800 text-sm">Mid-Semester Exams Begin</p>
                         <p className="text-xs text-gray-500">Check exam timetable on portal</p>
                      </div>
                   </div>
                   <div className="flex gap-4 items-center">
                      <div className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-center min-w-[60px]">
                         <span className="block text-xs font-bold uppercase">Nov</span>
                         <span className="block text-xl font-bold">12</span>
                      </div>
                      <div>
                         <p className="font-bold text-gray-800 text-sm">Graduation Ceremony</p>
                         <p className="text-xs text-gray-500">Main Auditorium, 9:00 AM</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2">Facility Hours</h3>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                       <span className="text-gray-600 flex items-center gap-2"><Clock size={14}/> Library</span>
                       <span className="font-medium text-gray-900">8:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-600 flex items-center gap-2"><Clock size={14}/> Cafeteria</span>
                       <span className="font-medium text-gray-900">7:00 AM - 8:30 PM</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-600 flex items-center gap-2"><Clock size={14}/> Sports Complex</span>
                       <span className="font-medium text-gray-900">6:00 AM - 9:00 PM</span>
                    </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default SchoolInfo;