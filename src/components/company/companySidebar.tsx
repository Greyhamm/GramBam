'use client';

import React, { useState } from 'react';
import InviteUserModal from '@/components/inviteUserModal';
import { Company } from '@/lib';

interface SidebarProps {
  userId: string;
  companies: Company[];
}

const Sidebar: React.FC<SidebarProps> = ({ userId, companies }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  return (
    <div className="w-64 bg-blue-800 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Actions</h2>
      <button
        onClick={openInviteModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Invite User
      </button>
      {isInviteModalOpen && (
        <InviteUserModal
          companies={companies}
          userId={userId}
          onClose={closeInviteModal}
          style={{ zIndex: 1200 }}
        />
      )}
    </div>
  );
};

export default Sidebar;