import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Document } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';
import DocumentCard from './DocumentCard';

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
    setLoading(false);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const aiProcessedCount = documents.filter(d => d.status === 'processed').length;

  if (loading) {
    return <div className="loading-state">Loading documents...</div>;
  }

  return (
    <div className="documents-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Document Intelligence</h1>
          <p className="page-subtitle">
            {documents.length} documents · {aiProcessedCount} AI-processed
          </p>
        </div>
        <button className="btn-upload">+ Upload Document</button>
      </div>

      <div className="search-bar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty-state">
          {searchQuery ? 'No documents match your search.' : 'No documents uploaded yet. Upload your first document to get started.'}
        </div>
      ) : (
        <div className="documents-grid">
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
