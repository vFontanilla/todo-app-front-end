import { CheckCircle, Circle, TrendingUp } from 'lucide-react';


// This component displays statistics about the to-do list.
const TodoStats = ({ todos }) => {
  // Calculate statistics based on the todos array prop
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{totalTodos}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedTodos}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{pendingTodos}</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Circle size={24} className="text-orange-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TodoStats;
