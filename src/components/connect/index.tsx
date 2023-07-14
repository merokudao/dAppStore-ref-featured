import React, { useState, useEffect, useRef } from 'react';
import { useSmartAccountContext } from '../../contexts/SmartAccountContext';
import { useWeb3AuthContext } from '../../contexts/SocialLoginContext';

interface ConnectButtonProps {}

const ConnectButton: React.FC<ConnectButtonProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { connect, address, loading: eoaWalletLoading, disconnect } = useWeb3AuthContext();
  const { loading } = useSmartAccountContext();
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const connectWeb3 = () => {
    connect()
  };

  const disConnectWeb3 = () => {
    disconnect()
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  console.log(address)
  function truncateAddress(address) {
    return address.slice(0, 6) + '...' + address.slice(-4);
}


  return (
    <div>
      <button 
        onClick={address ? openModal : connectWeb3} 
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        {address ? `${truncateAddress(address)}` : `Connect to Web3`}
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-50"></div>
          <div ref={modalRef} className="relative bg-black text-white p-8 rounded">
            <button 
              onClick={closeModal} 
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
            >
              X
            </button>
            <p>Your Smart Account: {address}</p>
            <button onClick={disConnectWeb3} className="mt-4 bg-red-500 text-white py-1 px-2 rounded">Disconnect</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectButton;
