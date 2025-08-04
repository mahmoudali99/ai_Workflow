import { Handle, Position } from 'react-flow-renderer';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function OutputNode({ data }: any) {
  return (
    <div className="p-4 border-2 rounded-lg shadow-lg bg-gradient-to-r from-green-50 to-green-100 min-w-[240px] max-w-[400px] transition-all duration-300 hover:shadow-xl relative">
      <div className="flex items-center justify-between">
        <strong className="text-lg text-green-700 font-semibold">Output</strong>
        <span className="text-xs text-gray-500">(Double-click to delete)</span>
      </div>
      <div className="mt-3">
        <div className="p-4 bg-white rounded-lg border-2 border-green-200 min-h-[120px] text-gray-700 prose prose-sm relative">
          {data.isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-progress-indeterminate"></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Processing...</p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">
              <ReactMarkdown 
                components={{
                  p: ({children}) => <p className="mb-2">{children}</p>,
                  ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  code: ({children}) => <code className="bg-gray-100 px-1 rounded">{children}</code>
                }}
              >
                {data.output || 'No output yet.'}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-green-500" />
    </div>
  );
}
