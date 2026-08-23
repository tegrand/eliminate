import React from 'react';
import { useAdminUI } from '../../contexts/AdminUIContext';
import { X } from 'lucide-react';

export default function AdminModal() {
  const { isModalOpen, closeModal, modalContent } = useAdminUI();

  if (!isModalOpen && !modalContent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300
          ${isModalOpen ? 'opacity-100' : 'opacity-0'}
        `} 
        onClick={closeModal}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div 
        className={`
          relative w-auto max-w-lg mx-auto my-6 z-50 transform transition-all duration-300 ease-in-out
          ${isModalOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t-xl">
            <h3 className="text-xl font-semibold text-gray-900">
              Modal Placeholder
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600 transition-colors"
              onClick={closeModal}
            >
              <X size={24} />
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            {modalContent || (
              <p className="my-4 text-gray-500 text-lg leading-relaxed">
                This is a placeholder for the global modal content.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
