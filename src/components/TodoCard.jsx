import { Check, Edit2, Trash2, Clock } from 'lucide-react';

const TodoCards = ({ todo, onEdit, onDelete, onToggleComplete }) => {

  const todo_id = todo.id;
  const todo_completed = todo.completed;
  const todo_title = todo.title;
  const todo_description = todo.description;
  const todo_created = todo.created_at;
  const todo_updated = todo.updated_at;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      todo_completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => onToggleComplete(todo_id)}
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                todo_completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {todo_completed === 1 && <Check size={12} />}
            </button>

            <div className="flex-1">
              <h3 className={`font-semibold text-lg transition-colors duration-200 ${
                todo_completed ? 'text-green-700 line-through' : 'text-gray-900'
              }`}>
                {todo_title}
              </h3>

              {todo_description && (
                <p className={`mt-1 text-sm transition-colors duration-200 ${
                  todo_completed ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {todo_description}
                </p>
              )}

              <div className="flex items-center mt-3 text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                <span>Created {formatDate(todo_created)}</span>
                {todo_updated && todo_updated !== todo_created && (
                  <span className="ml-2">• Updated {formatDate(todo_updated)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(todo.id)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <Edit2 size={16} />
            </button>

            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCards;
