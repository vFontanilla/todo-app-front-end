import { useState, useEffect } from 'react'
import './App.css'
import { Plus, AlertCircle, CheckSquare } from 'lucide-react';
import TodoStats from './components/TodoStats';
import TodoCards from './components/TodoCard';
import TodoForm from './components/TodoFormCreate';

function App() {

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch todos from the backend
  useEffect(() => {
    const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/todos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched todos:', data);

      // Check for duplicate IDs
      const ids = data.map(todo => todo.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn('Duplicate IDs detected:', ids);
      }
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    fetchTodos();
  }, []); // Empty dependency array means this runs once on mount

  const handleCreateTodo = async (todoData) => {
    if (!todoData.title || !todoData.description) {
      setError('Title and description are required');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create todo');
      }

      const newTodo = await response.json();

      // setTodos(prev => [...prev, newTodo]);
      setTodos(prev => [newTodo, ...prev]);

      setShowForm(false);
      setEditingTodo(null);
      setError(null); // clear any previous error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTodo = async (id, updatedData) => {
    console.log("Edit clicked for:", id, updatedData.title, );

    if (!updatedData.title || !updatedData.description) {
      setError('Title and description are required');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      setError(null);
      setShowForm(false);
      setEditingTodo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (todo) => {
    console.log("Edit clicked for:", todo.title, todo.description, todo.id);
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleUpdate = (updatedData) => {
    const { id, title, description } = updatedData;
    console.log("Updating todo:", id, title, description);
    handleEditTodo(id, { title, description });
  };

  const handleDelete = async (id) => {
    console.log("Delete clicked for:", id);
    try {
      const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseForm = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  const handleToggleComplete = async (id) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    if (!todoToToggle) return;

    let updatedTodo = null; // ✅ Declare here so it can be used later

    try {
      const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todoToToggle.completed }),
      });

      if (!response.ok) {
        console.log("ERROR Response!!!!");
      }

      console.log("Response:", response);

      try {
        updatedTodo = await response.json(); // ✅ Assign to the outer variable

        if (updatedTodo && updatedTodo.id !== id) {
          console.warn('Invalid updatedTodo:', updatedTodo);
          setError('Failed to update todo due to invalid ID.');
          return;
        }
      } catch (jsonError) {
        console.error('JSON parsing failed:', jsonError.message);
        setError('Failed to parse API response');
        return;
      }

      console.log(updatedTodo.id, "is equal to", id);

      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((todo) => 
          todo.id === id ? (updatedTodo || { ...todo, completed: !todo.completed }) : todo
        );
        console.log('Updated todos after toggle:', updatedTodos);
        return updatedTodos;
      });

      console.log("Updated todo:", updatedTodo);
    } catch (err) {
      setError(err.message);
      console.log("ERROR Response:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>

        <header className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <CheckSquare size={32} className='text-blue-600 mr-3' />
            <h1 className='text-4xl font-bold text-gray-900'>TodoApp</h1>
          </div>
          <p className="text-gray-600 text-lg">Organize your tasks efficiently</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Stats Component */}
        <TodoStats todos={todos} />

        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            Your tasks ({todos.length})
          </h2>

          <button
          onClick={() => setShowForm(true)} 
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2'>
            <Plus size={20} />
            <span>Add Todo</span>
          </button>
        </div>

        {/* Conditional Rendering based on state */}
        {loading && <p>Loading tasks...</p>}

        {todos.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No todos yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first todo!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Your First Todo
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {todos.map((todo) => (
              <TodoCards 
                key={todo.id} 
                todo={todo} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}

        {(showForm) && (
          <TodoForm
            todo={editingTodo}
            onSubmit={editingTodo ? handleUpdate  : handleCreateTodo}
            onCancel={handleCloseForm}
            isLoading={isSubmitting}
          />
        )}

      </div>
    </div>
  );
}

export default App