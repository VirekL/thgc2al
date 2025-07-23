import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AchievementCard from '../pages/list';

export function SortableAchievement({
  id,
  achievement,
  index,
  devMode,
  hoveredIdx,
  setHoveredIdx,
  handleEditAchievement,
  handleDuplicateAchievement,
  handleRemoveAchievement,
  achievementRefs,
  showNewForm,
  scrollToIdx,
  setShowNewForm
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '2px dashed #e67e22' : '1px solid #333',
    marginBottom: 8,
    background: '#181818',
    cursor: 'move',
    borderRadius: 8,
    position: 'relative'
  };

  return (
    <div
      ref={el => {
        setNodeRef(el);
        achievementRefs.current[index] = el;
      }}
      {...attributes}
      {...listeners}
      style={style}
      onClick={() => {
        if (showNewForm && scrollToIdx === index) setShowNewForm(false);
      }}
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={() => setHoveredIdx(v => v === index ? null : v)}
    >
      {(hoveredIdx === index) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 32,
          zIndex: 2,
          background: 'var(--secondary-bg, #232323)',
          borderRadius: '1.5rem',
          padding: '22px 40px',
          boxShadow: '0 4px 24px #000b',
          alignItems: 'center',
          border: '2px solid var(--primary-accent, #e67e22)',
          transition: 'background 0.2s, border 0.2s',
        }}>
          <button
            title="Edit"
            style={{
              background: 'var(--info, #2980b9)',
              border: 'none',
              color: '#fff',
              fontSize: 44,
              cursor: 'pointer',
              opacity: 1,
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0006',
              transition: 'background 0.15s, transform 0.1s',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--info-hover, #3498db)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--info, #2980b9)'}
            onClick={e => {e.stopPropagation(); handleEditAchievement(index);}}
          >✏️</button>
          <button
            title="Duplicate"
            style={{
              background: 'var(--primary-accent, #e67e22)',
              border: 'none',
              color: '#fff',
              fontSize: 44,
              cursor: 'pointer',
              opacity: 1,
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0006',
              transition: 'background 0.15s, transform 0.1s',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--primary-accent-hover, #ff9800)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--primary-accent, #e67e22)'}
            onClick={e => {e.stopPropagation(); handleDuplicateAchievement(index);}}
          >📄</button>
          <button
            title="Remove"
            style={{
              background: 'var(--danger, #c0392b)',
              border: 'none',
              color: '#fff',
              fontSize: 44,
              cursor: 'pointer',
              opacity: 1,
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0006',
              transition: 'background 0.15s, transform 0.1s',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--danger-hover, #e74c3c)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--danger, #c0392b)'}
            onClick={e => {e.stopPropagation(); handleRemoveAchievement(index);}}
          >🗑️</button>
        </div>
      )}
      <AchievementCard achievement={achievement} devMode={devMode} />
    </div>
  );
}
