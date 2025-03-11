import React, { useState } from 'react';
import { addSite } from '../utils/api';

const AddSiteForm = ({ onSiteAdded }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !url) {
      setError('Both name and url are required');
      return;
    }

    try {
      await addSite({ name, url, is_active: isActive });
      setName('');
      setUrl('');
      setIsActive(true);
      alert('Site added successfully!');
      onSiteAdded(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Website Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Website URL:</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
      </div>
      <div>
        <label>Active:</label>
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <span>{isActive ? 'Active' : 'Inactive'}</span>
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Add Website</button>
    </form>
  );
};

export default AddSiteForm;
