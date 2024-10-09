// PersonList.tsx
import React from 'react';
import { Person } from './types';

interface PersonListProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
}

const PersonList: React.FC<PersonListProps> = ({ people, onEdit, onDelete }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {people.map((person) => (
        <li key={person.id} className="py-4 flex justify-between">
          <div>
            <p className="font-bold">{person.name}</p>
            <p className="text-sm text-gray-500">{person.position}</p>
          </div>
          <div>
            <button onClick={() => onEdit(person)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
            <button onClick={() => person.id && onDelete(person.id)} className="text-red-600 hover:text-red-800">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PersonList

