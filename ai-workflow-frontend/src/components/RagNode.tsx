import { Handle, Position } from 'react-flow-renderer';
import React from 'react';

export default function RAGNode({ data }: any) {
  return (
    <div className="p-4 border-2 rounded-lg shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 min-w-[240px] max-w-[400px] transition-all duration-300 hover:shadow-xl">
      <strong className="text-lg text-purple-700 font-semibold">RAG</strong>
      <div className="mt-3 relative">
        <input
          type="file"
          accept="application/pdf"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
          onChange={(e) => {
            if (e.target.files?.[0]) data.onUpload(e.target.files[0]);
          }}
        />
      </div>
      <Handle type="target" position={Position.Left} className="!bg-purple-500" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500" />
    </div>
  );
}
