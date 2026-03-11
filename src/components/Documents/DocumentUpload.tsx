import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { DocumentCategory } from '../../types/database';

interface DocumentUploadProps {
  onUploadSuccess: () => void;
}

export function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('other');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        if (uploadError.message.includes('not found')) {
          const { error: bucketError } = await supabase.storage.createBucket('documents', {
            public: false,
          });

          if (bucketError) {
            throw new Error('Failed to create storage bucket');
          }

          const { error: retryError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          title,
          description,
          category,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (docError) throw docError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-document`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ documentId: docData.id }),
      }).catch(err => console.error('Background processing error:', err));

      setTitle('');
      setDescription('');
      setCategory('other');
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="upload-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 8l-5-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3>Upload Document</h3>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
            placeholder="Enter document title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="form-textarea"
            placeholder="Add description (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            className="form-select"
          >
            <option value="other">Other</option>
            <option value="law_proposal">Law Proposal</option>
            <option value="report">Report</option>
            <option value="memo">Memo</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">File</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={handleFileChange}
              required
              accept=".pdf,.doc,.docx,.txt,image/*"
              className="form-file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-input-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{file ? file.name : 'Choose file'}</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className={`btn-submit ${uploading || !file ? 'disabled' : ''}`}
        >
          {uploading ? (
            <>
              <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload Document'
          )}
        </button>
      </form>
    </div>
  );
}
