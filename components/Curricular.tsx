
import React, { useState } from 'react';
import { BookOpen, Clock, MoreVertical, Users, CheckCircle2, AlertCircle, Plus, PenTool } from 'lucide-react';
import { View } from '../types';

// Accept setView prop or similar to navigate
// But to fit into existing structure where `App.tsx` renders this, let's use a callback or access the App's setView logic?
// Wait, `App.tsx` renders `Curricular` but doesn't pass `setView` to it in the previous code block.
// I need to update `App.tsx` to pass `setView` to `Curricular` first, OR simpler: 
// I can't modify `App.tsx` in this XML block if I didn't plan to. 
// Let's check if `App.tsx` passed props. It passed `isEducator`. 
// To fix navigation without props, I would need to pass `setView`. 
// Let's assume I can update `App.tsx` in this turn to pass `setView` to `Curricular`. 
// Wait, better yet, I'll use a temporary workaround or just update App.tsx as well.
// Actually, I will update `App.tsx` to pass `setView` to `Curricular`.

interface CurricularProps {
    isEducator?: boolean;
    setView?: (view: View) => void;
}

const Curricular: React.FC<CurricularProps> = ({ isEducator = false, setView }) => {
  const courses = [
    { id: 1, title: 'Physics II: Electromagnetism', code: 'PHY-201', instructor: 'Dr. Emily Stone', progress: 65, nextClass: 'Tue, 2:00 PM', color: 'bg-orange-500', students: 45 },
    { id: 2, title: 'Computer Studies: Advanced JS', code: 'CS-305', instructor: 'Prof. Alan Turing', progress: 80, nextClass: 'Mon, 10:00 AM', color: 'bg-blue-500', students: 32 },
    { id: 3, title: 'Calculus III', code: 'MAT-301', instructor: 'Dr. Sarah Conner', progress: 40, nextClass: 'Wed, 1:00 PM', color: 'bg-purple-500', students: 28 },
    { id: 4, title: 'Digital Logic Design', code: 'ENG-210', instructor: 'Eng. Robert Stark', progress: 90, nextClass: 'Fri, 9:00 AM', color: 'bg-green-500', students: 50 },
  ];

  const assignments = [
    { id: 1, title: 'Lab Report 4', course: 'Physics II', due: 'Tomorrow', status: 'pending' },
    { id: 2, title: 'React Project', course: 'Computer Studies', due: 'In 3 days', status: 'pending' },
    { id: 3, title: 'Integration Quiz', course: 'Calculus III', due: 'Passed', status: 'completed' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{isEducator ? "Teaching Management" : "My Courses"}</h2>
          <p className="text-gray-500">{isEducator ? "Manage your classes, assignments, and student rosters." : "Manage your enrolled subjects and assignments."}</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-2">
          <Plus size={16} /> {isEducator ? "Create Class" : "Enroll New"}
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className={`h-24 ${course.color} p-4 text-white relative`}>
              <h3 className="font-bold text-lg truncate">{course.title}</h3>
              <p className="text-white/80 text-sm">{course.code}</p>
              <button className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                {isEducator ? (
                     <span className="flex items-center gap-2"><Users size={14} /> {course.students} Students</span>
                ) : (
                     <span className="flex items-center gap-2"><Users size={14} /> {course.instructor}</span>
                )}
              </div>
              <div>
                {isEducator ? (
                    <div className="flex gap-2 mt-2">
                         <button 
                            onClick={() => setView && setView(View.EDUCATOR_STUDIO)}
                            className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded hover:bg-gray-200 transition"
                         >
                             Gradebook
                         </button>
                         <button 
                            onClick={() => setView && setView(View.EDUCATOR_STUDIO)}
                            className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded hover:bg-gray-200 transition"
                         >
                             Roster
                         </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-bold text-gray-700">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${course.color}`} style={{ width: `${course.progress}%` }}></div>
                        </div>
                    </>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {course.nextClass}
                </span>
                <button 
                    onClick={() => isEducator && setView ? setView(View.EDUCATOR_STUDIO) : null}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    {isEducator ? "Manage Class" : "View Course"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Assignments & Study Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" /> {isEducator ? "Pending Grading" : "Upcoming Tasks"}
            </h3>
            {isEducator && <button className="text-xs text-primary font-bold hover:underline">+ New Assignment</button>}
          </div>
          <div className="space-y-3">
            {assignments.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isEducator ? 'bg-purple-100 text-purple-600' : (task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600')}`}>
                    {isEducator ? <PenTool size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${task.status === 'pending' ? 'text-orange-500' : 'text-green-500'}`}>
                    {task.due}
                  </p>
                  <button 
                    onClick={() => isEducator && setView ? setView(View.EDUCATOR_STUDIO) : null}
                    className="text-xs text-gray-400 hover:text-primary mt-1"
                   >
                       {isEducator ? "Grade Now" : "Details"}
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Groups / Faculty Notice Teaser */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <Users size={32} className="mb-4 text-white/80" />
          <h3 className="text-xl font-bold mb-2">{isEducator ? "Department Meeting" : "Study Groups"}</h3>
          <p className="text-white/70 text-sm mb-6">
            {isEducator 
                ? "Monthly faculty meeting scheduled for Friday, 3 PM at the Main Conference Hall."
                : "Join 5 active study groups for your courses. Collaborate and share notes."}
          </p>
          <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-100 transition">
            {isEducator ? "View Agenda" : "Find a Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Curricular;
