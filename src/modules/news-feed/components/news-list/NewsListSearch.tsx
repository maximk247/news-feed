import React from 'react';
import { Input, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { palette } from '@shared/styles/palette';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

interface NewsListSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
}

const tagRender = ({ label, closable, onClose }: CustomTagProps) => (
  <span
    style={{
      padding: '4px 8px',
      margin: '4px',
      background: palette.tagBackground,
      borderRadius: 4,
      display: 'inline-flex',
      alignItems: 'center',
    }}
  >
    {label}
    {closable && (
      <CloseOutlined
        onClick={onClose}
        style={{
          fontSize: 12,
          marginLeft: 6,
          cursor: 'pointer',
          color: palette.textMuted,
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = palette.textPrimary)}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = palette.textMuted)}
      />
    )}
  </span>
);

const NewsListSearch: React.FC<NewsListSearchProps> = ({
  searchValue,
  onSearchChange,
  selectedTags,
  onTagsChange,
  availableTags,
}) => {
  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 20,
      }}
    >
      <Input
        placeholder="Search by title"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        variant="borderless"
        style={{
          borderBottom: `1px solid ${palette.border}`,
          borderRadius: 0,
          padding: '10px 14px',
        }}
      />
      <Select
        mode="multiple"
        allowClear
        placeholder="Filter by tags"
        value={selectedTags}
        onChange={onTagsChange}
        style={{
          width: '100%',
          padding: '4px',
          borderRadius: 0,
        }}
        variant="borderless"
        options={availableTags.map((tag) => ({ label: tag, value: tag }))}
        showSearch
        tagRender={tagRender}
      />
    </div>
  );
};

export default NewsListSearch;
