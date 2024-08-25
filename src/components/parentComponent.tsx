import React, { useState } from 'react';
import ProjectList from './company/projectList';
import InviteUserModal from './inviteUserModal';
import { Company } from '@/lib';

interface ParentComponentProps {
  companies: Company[];
  userId: string;
}

const ParentComponent: React.FC<ParentComponentProps> = ({ companies, userId }) => {
  const [isProjectFilterOpen, setIsProjectFilterOpen] = useState(false);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);

  const handleInviteUser = () => {
    if (isProjectFilterOpen) {
      setIsProjectFilterOpen(false);
    }
    setIsInviteUserOpen(true);
  };

  return (
    <div>
      <button
        onClick={handleInviteUser}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        style={{ zIndex: 1100 }}
      >
        Invite User
      </button>

      <ProjectList onModalOpen={setIsProjectFilterOpen} />

      {isInviteUserOpen && (
        <InviteUserModal
          companies={companies}
          userId={userId}
          onClose={() => setIsInviteUserOpen(false)}
          style={{ zIndex: 1200 }}
        />
      )}
    </div>
  );
};

export default ParentComponent;