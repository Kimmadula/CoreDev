import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", isDanger = true }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)'
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                width: '400px',
                maxWidth: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid #e5e7eb'
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>
                    {title}
                </h3>
                <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            background: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            color: '#374151',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '8px 16px',
                            background: isDanger ? '#dc2626' : '#4f46e5',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
