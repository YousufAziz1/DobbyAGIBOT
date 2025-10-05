"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

export default function ModelSelector({ token, value, onChange }:{ token?: string|null; value?: string; onChange: (v: string)=>void }) {
  const safeList = [{ id: 'openai/gpt-4o-mini', label: 'OpenAI GPT-4o Mini' }];
  const [models, setModels] = useState<Array<{ id: string; label: string }>>(safeList);

  useEffect(() => {
    apiClient(token || undefined)
      .get('/models')
      .then(res => {
        const list = Array.isArray(res.data) && res.data.length ? res.data : safeList;
        setModels(list);
        if (!value && list[0]?.id) onChange(list[0].id);
      })
      .catch(() => {
        setModels(safeList);
        if (!value && safeList[0]?.id) onChange(safeList[0].id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <select
      className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40"
      value={value || ''}
      onChange={e=>onChange(e.target.value)}
    >
      {models.map(m => (
        <option key={m.id} value={m.id}>{m.label}</option>
      ))}
    </select>
  );
}
