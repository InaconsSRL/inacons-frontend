/* // PersonForm.tsx
import React, { useState, useEffect } from 'react';
import { Person } from './types';

interface PersonFormProps {
  person: Person | null;
  onSubmit: (person: Person) => void;
  onCancel: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Person>({ name: '', profile: '', position: '' });

  useEffect(() => {
    if (person) {
      setFormData(person);
    } else {
      setFormData({ name: '', profile: '', position: '' });
    }
  }, [person]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', profile: '', position: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        name="profile"
        value={formData.profile}
        onChange={handleChange}
        placeholder="Profile"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        name="position"
        value={formData.position}
        onChange={handleChange}
        placeholder="Position"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <div className="flex justify-end">
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {person ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};


 */