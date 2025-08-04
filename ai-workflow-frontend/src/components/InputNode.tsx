import { Handle, Position } from 'react-flow-renderer';
import React from 'react';

export default function InputNode({ data }: any) {
  return (
    <div className="p-4 border-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 min-w-[240px] max-w-[400px] transition-all duration-300 hover:shadow-xl">
      <strong className="text-lg text-blue-700 font-semibold">Input</strong>
      <textarea
        rows={4}
        placeholder="Enter your prompt..."
        className="w-full mt-3 border-2 border-blue-200 rounded-md p-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none resize-y min-h-[100px] text-gray-700 placeholder-gray-400"
        onChange={(e) => data.onChange(e.target.value)}
      />
      <Handle type="source" position={Position.Right} className="!bg-blue-500" />
    </div>
  );
}
