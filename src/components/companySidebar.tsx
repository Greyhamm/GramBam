import React from 'react';
import InviteUserModal from '@/components/inviteUserModal';
import { Company } from '@/lib';

interface SidebarProps {
  userId: string;
  companies: Company[];
}

const Sidebar: React.FC<SidebarProps> = ({ userId, companies }) => {
  return (
    <div className="w-64 bg-blue-800 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Actions</h2>
      <InviteUserModal companies={companies} userId={userId} />
    </div>
  );
};

export default Sidebar;