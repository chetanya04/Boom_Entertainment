import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';

const UploadForm: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'short',
    videoUrl: '',
    price: 0,
    videoFile: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    const { title, description, type, videoFile, videoUrl, price } = form;

    data.append('title', title);
    data.append('description', description);
    data.append('type', type);
    data.append('creatorId', 'some-user-id');

    if (type === 'short' && videoFile) data.append('videoFile', videoFile);
    if (type === 'long') {
      data.append('videoUrl', videoUrl);
      data.append('price', price.toString());
    }

    try {
      await axios.post('http://localhost:5000/api/upload', data);
      alert('Upload successful!');
      setForm({
        title: '',
        description: '',
        type: 'short',
        videoUrl: '',
        price: 0,
        videoFile: null,
      });
    } catch {
      alert('Upload failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
  <h2>Upload Video</h2>

  <div className="form-group">
    <input
      type="text"
      name="title"
      className="form-input"
      placeholder="Title *"
      value={form.title}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group">
    <textarea
      name="description"
      className="form-textarea"
      placeholder="Description"
      value={form.description}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <select
      name="type"
      className="form-select"
      value={form.type}
      onChange={handleChange}
    >
      <option value="short">Short</option>
      <option value="long">Long</option>
    </select>
  </div>

  {form.type === 'short' && (
    <div className="form-group conditional-section">
      <input
        type="file"
        name="videoFile"
        className="form-input"
        accept="video/*"
        onChange={handleChange}
        required
      />
    </div>
  )}

  {form.type === 'long' && (
    <div className="conditional-section">
      <div className="form-group">
        <input
          type="url"
          name="videoUrl"
          className="form-input"
          placeholder="YouTube/Vimeo URL *"
          value={form.videoUrl}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          name="price"
          className="form-input"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  )}

  <button
    type="submit"
    className={`submit-button${isLoading ? ' loading' : ''}`}
    disabled={isLoading}
  >
    {isLoading ? 'Uploading...' : 'Upload'}
  </button>
</form>

  );
};

export default UploadForm;
