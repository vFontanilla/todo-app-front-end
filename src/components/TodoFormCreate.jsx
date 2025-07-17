import { useState } from 'react';
import { X, Plus, Edit } from 'lucide-react';

const TodoForm = ({ todo, onSubmit, onCancel, isLoading }) => {
	const [title, setTitle] = useState('');
  	const [description, setDescription] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!title.trim() || !description.trim()) return;

		// Pass the data to parent
		onSubmit({ title, description });
	};

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
			<form onSubmit={handleSubmit} className="p-6">
			  <div className="mb-4">
				<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
				  Title *
				</label>
				<input
				  type="text"
				  value={title}
				  onChange={(e) => setTitle(e.target.value)}
				  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				  placeholder="Enter todo title..."
				  required
				/>
			  </div>
			  
			  <div className="mb-6">
				<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
				  Description *
				</label>
				<textarea
				  value={description}
				  onChange={(e) => setDescription(e.target.value)}
				  rows={3}
				  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				  placeholder="Enter todo description..."
				/>
			  </div>
			  
			  <div className="flex space-x-3">
				<button
					type="submit"
					disabled={isLoading}
					className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white text-sm tracking-wide
						transition duration-200 ease-in-out
						${isLoading 
						? 'bg-blue-400 cursor-not-allowed'
						: 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none'}
					`}
					>
					{isLoading ? (
						<div className="flex items-center justify-center space-x-2">
						<svg
							className="animate-spin h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
							/>
							<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
							/>
						</svg>
						<span>Adding...</span>
						</div>
					) : (
						'Add Todo'
					)}
				</button>
				
				<button
				  type="button"
				  onClick={onCancel}
				  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
				>
				  Cancel
				</button>
			  </div>
			</form>
		</div>
    </div>
  );
};

export default TodoForm;