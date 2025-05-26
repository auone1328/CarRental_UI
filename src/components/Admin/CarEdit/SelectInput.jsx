import { useState } from "react";

export default function MyDropdown( {options } ) {

  const [selectedId, setSelectedId] = useState('');

  return (
    <select 
      value={selectedId}
      onChange={(e) => setSelectedId(e.target.value)}
    >
      <option value="">Выберите пункт</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.text}
        </option>
      ))}
    </select>
  );
}