import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
} from 'react-flow-renderer';

import InputNode from './components/InputNode';
import RAGNode from './components/RagNode';
import OutputNode from './components/OutputNode';
import { uploadPDF, queryAI } from './api';

let id = 0;
const getId = () => `node_${id++}`;

const nodeTypes = {
  inputNode: InputNode,
  ragNode: RAGNode,
  outputNode: OutputNode,
};

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'string' && reactFlowBounds) {
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };
        const newNode = {
          id: getId(),
          type,
          position,
          data: {
            onChange: (val: string) => {
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === newNode.id ? { ...n, data: { ...n.data, prompt: val } } : n
                )
              );
            },
            onUpload: async (file: File) => {
              const docId = await uploadPDF(file);
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === newNode.id
                    ? { ...n, data: { ...n.data, file, docId } }
                    : n
                )
              );
            },
            output: '',
          },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes]
  );

  const addNode = (type: 'inputNode' | 'ragNode' | 'outputNode') => {
    const newNode = {
      id: getId(),
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        onChange: (val: string) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === newNode.id ? { ...n, data: { ...n.data, prompt: val } } : n
            )
          );
        },
        onUpload: async (file: File) => {
          const docId = await uploadPDF(file);
          setNodes((nds) =>
            nds.map((n) =>
              n.id === newNode.id
                ? { ...n, data: { ...n.data, file, docId } }
                : n
            )
          );
        },
        output: '',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const [isLoading, setIsLoading] = useState(false);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: any) => {
    setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
    setEdges((edges) => edges.filter((e) => e.source !== node.id && e.target !== node.id));
  }, [setNodes, setEdges]);

  const runFlow = async () => {
    const inputNode = nodes.find((n) => n.type === 'inputNode');
    const ragNode = nodes.find((n) => n.type === 'ragNode');
    const outputNode = nodes.find((n) => n.type === 'outputNode');

    if (!inputNode?.data.prompt || !ragNode?.data.docId) {
      alert('Please fill in the input and upload a PDF');
      return;
    }

    setIsLoading(true);
    try {
      const answer = await queryAI(inputNode.data.prompt, ragNode.data.docId);
      setNodes((nds) =>
        nds.map((n) =>
          n.id === outputNode?.id
            ? { ...n, data: { ...n.data, output: answer, isLoading: false } }
            : n
        )
      );
    } catch (error) {
      console.error('Error running flow:', error);
      alert('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Workflow Nodes</h2>
        <div className="space-y-3">
          <div
            className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg cursor-move hover:shadow-md transition-all"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', 'inputNode');
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <div className="flex items-center">
              <span className="text-blue-600 text-lg mr-2">◆</span>
              <span className="font-medium text-gray-700">Input Node</span>
            </div>
          </div>
          
          <div
            className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg cursor-move hover:shadow-md transition-all"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', 'ragNode');
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <div className="flex items-center">
              <span className="text-purple-600 text-lg mr-2">◆</span>
              <span className="font-medium text-gray-700">RAG Node</span>
            </div>
          </div>
          
          <div
            className="p-3 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg cursor-move hover:shadow-md transition-all"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', 'outputNode');
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <div className="flex items-center">
              <span className="text-green-600 text-lg mr-2">◆</span>
              <span className="font-medium text-gray-700">Output Node</span>
            </div>
          </div>
        </div>
        
        <button 
          className="mt-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          onClick={runFlow}
        >
          <span className="text-xl">▶</span>
          <span>Run Workflow</span>
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeDoubleClick={onNodeDoubleClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
