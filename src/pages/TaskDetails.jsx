import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  ChevronRight, 
  Share2, 
  MoreHorizontal, 
  Circle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Paperclip, 
  Plus, 
  Download, 
  User,
  X 
} from 'lucide-react';
import '../style/taskDetails.css';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, currentUser } = useTasks();
  const task = tasks?.find(t => t.id?.toString() === id?.toString());

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setComments(task.comments || []);
      setAttachments(task.attachments || []);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="center-content" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Task not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The task with ID #{id} could not be loaded.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // OBSŁUGA KLIKNIĘCIA "ADD ATTACHMENT"
  const handleAddAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // OBSŁUGA WYBORU PLIKU Z DYSKU
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
    if (file.size > 1024 * 1024) {
      formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const newAttachment = {
      id: Date.now(),
      name: file.name,
      size: formattedSize
    };

    const updatedAttachments = [...attachments, newAttachment];
    setAttachments(updatedAttachments);
    e.target.value = ''; 

    // Zapis do Firebase
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { attachments: updatedAttachments });
    } catch (error) {
      console.error("Błąd zapisu załącznika:", error);
    }
  };

  // OBSŁUGA POBIERANIA PLIKÓW (DOWNLOAD)
  const handleDownloadAttachment = (attachment) => {
    alert(`Downloading functionality requires Firebase Storage integration.\nFile name: ${attachment.name}`);
  };


  // const handleDownloadAttachment = (attachment) => {
  //   if (attachment.fileObject) {
  //     const url = URL.createObjectURL(attachment.fileObject);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = attachment.name;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   } else {
  //     alert(`Rozpoczęto pobieranie pliku: ${attachment.name}\n(W środowisku produkcyjnym pobrano by plik z adresu URL: ${attachment.url || '/api/files/' + attachment.id})`);
  //   }
  // };

  // ZAPISYWANIE KOMENTARZY DO FIREBASE
  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: currentUser?.firstName || "Dev Stranger",
      text: newCommentText.trim(),
      date: new Date().toLocaleDateString()
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setNewCommentText(''); 

    // Zapis do Firebase
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { comments: updatedComments });
    } catch (error) {
      console.error("Błąd zapisu komentarza:", error);
    }
  };

  // USUWANIE KOMENTARZY
  const handleDeleteComment = async (commentId) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { comments: updatedComments });
    } catch (error) {
      console.error("Błąd usuwania komentarza:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const getPriorityClass = (priority) => {
    const p = priority?.toUpperCase();
    if (p === 'CRIT' || p === 'CRITICAL') return 'priority-tag critical';
    if (p === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'NOT SET';
    try {
      const cleanStr = String(dateStr).split(' ')[0];
      const date = new Date(cleanStr);
      if (isNaN(date.getTime())) return String(dateStr).toUpperCase();
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    } catch (e) {
      console.error("Błąd formatowania daty:", e);
      return 'NOT SET';
    }
  };
  const startDateValue = task.createdAt || task.created_at || task.startDate;
  const endDateValue = task.deadline || task.endDate;

  return (
    <div className="center-content kanban-page task-details-page">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div className="breadcrumb-container">
          <span className="breadcrumb-link" onClick={() => navigate('/')}>Dashboard</span>
          <ChevronRight size={14} style={{ opacity: 0.6 }} />
          <span className="breadcrumb-current">{task.title}</span>
        </div>
        
        <div className="action-header-group">
          <button className="btn-primary share-btn"><Share2 size={14} /> SHARE</button>
          <button className="icon-btn more-btn"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      <div className="kanban-board-grid" style={{ gridTemplateColumns: '1fr 320px', gap: '40px' }}>
        
        <div className="column-tasks-container" style={{ gap: '32px' }}>
          
          <div>
            <h1 className="kanban-title task-title-large">{task.title || 'Untitled Task'}</h1>
            <div className="status-meta-row">
              <span className="filter-chip active status-chip">
                <Circle size={10} fill="currentColor" /> {task.status || 'To do'}
              </span>
              <span className={getPriorityClass(task.priority)}>
                {(task.priority === 'CRIT' || task.priority === 'critical') && <AlertTriangle size={12} />}
                {task.priority || 'LOW'}
              </span>
              <span className="deadline deadline-display">
                <Calendar size={14} /> {task.deadline ? String(task.deadline).toUpperCase() : 'NO DEADLINE'}
              </span>
            </div>
          </div>

          {/* NAPRAWIONY CZYSTY OPIS */}
          <div>
            <h2 className="category-tag section-heading-row">
              <FileText size={14} /> Description
            </h2>
            <div className="card" style={{ margin: 0, padding: '20px', backgroundColor: 'var(--bg-card-dark)', borderRadius: '12px' }}>
              {task.description ? (
                <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                  {task.description}
                </p>
              ) : (
                <p className="empty-state-text" style={{ margin: 0 }}>
                  No description provided.
                </p>
              )}
            </div>
          </div>

          {/* ATTACHMENTS */}
          <div>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h2 className="category-tag section-heading-row">
                <Paperclip size={14} /> Attachments <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({attachments.length})</span>
              </h2>
              <button onClick={handleAddAttachmentClick} className="icon-btn add-attachment-btn">
                <Plus size={14} /> Add Attachment
              </button>
            </div>

            {attachments.length > 0 ? (
              <div className="attachments-list">
                {attachments.map(file => (
                  <div key={file.id} className="card attachment-card">
                    <div className="attachment-left">
                      <div className="file-ext-badge">{file.name?.split('.').pop()?.toUpperCase() || 'FILE'}</div>
                      <div>
                        <div className="file-name-text">{file.name}</div>
                        <div className="file-size-text">{file.size}</div>
                      </div>
                    </div>
                    
                    <div className="attachment-actions">
                      <button 
                        className="icon-btn download-attachment-btn" 
                        title="Download"
                        onClick={() => handleDownloadAttachment(file)}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state-text">No attachments uploaded.</p>
            )}
          </div>

          {/* COMMENTS */}
          <div>
            <h2 className="category-tag section-heading-row">
              <Plus size={14} style={{ transform: 'rotate(45deg)' }} /> Activity & Comments <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({comments.length})</span>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="comment-block">
                    <div className="flex-between" style={{ marginBottom: '8px', alignItems: 'center' }}>
                      <span className="comment-author">@{comment.author.replace(/\s+/g, '').toLowerCase()}</span>
                      
                      <div className="comment-meta-right">
                        <span className="comment-date">{comment.date}</span>
                        {(comment.author === "Dev Stranger" || comment.author === currentUser?.firstName) && (
                          <button onClick={() => handleDeleteComment(comment.id)} className="comment-delete-action">
                            DELETE
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="comment-body-text">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="empty-state-text" style={{ marginBottom: '8px' }}>No comments yet. Start the discussion below.</p>
              )}

              <div className="new-comment-form">
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="new-comment-input"
                />
                <button onClick={handleAddComment} className="btn-primary send-comment-btn">SEND</button>
              </div>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ASSIGNEES */}
          <div className="card" style={{ margin: '0' }}>
            <span className="category-tag section-heading-row" style={{ fontSize: '11px' }}>
              <User size={12} /> ASSIGNEES (1)
            </span>
            <div className="assignees-list">
              {currentUser && (
                <div className="assignee-item">
                  <div className="assignee-avatar">
                    {currentUser.avatarInitials || currentUser.firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="assignee-name">{currentUser.firstName} {currentUser.lastName || ''}</div>
                    <div className="assignee-title">{currentUser.title || 'User'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ margin: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="dates-grid">
              <div>
                <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>START DATE</span>
                <span className="date-value">{formatDate(startDateValue)}</span>
              </div>
              <div>
                <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>END DATE</span>
                <span className="date-value end">{formatDate(endDateValue)}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ margin: '0' }}>
            <span className="category-tag" style={{ display: 'block', marginBottom: '16px', fontSize: '11px' }}>TAGS</span>
            <div className="tags-flex">
              {task.tags && task.tags.length > 0 ? (
                task.tags.map((tag, idx) => (
                  <span key={idx} className={`priority-tag ${idx % 2 === 0 ? 'low' : 'high'} tag-item ${idx % 2 === 0 ? 'even' : ''}`}>
                    {tag}
                  </span>
                ))
              ) : (
                <span className="empty-state-text" style={{ fontStyle: 'italic' }}>No tags provided</span>
              )}
            </div>
          </div>

          <div className="close-panel-row">
            <button onClick={() => navigate(-1)} className="close-details-btn">
              <X size={12} /> Close details
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}