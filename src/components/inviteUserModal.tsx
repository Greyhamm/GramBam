'use client';

import { useState } from 'react';
import { createInvitation } from '@/actions';
import { Company } from '@/lib';

interface InviteUserModalProps {
  companies: Company[];
  userId: string;
}

export default function InviteUserModal({ companies, userId }: InviteUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'manager' | 'supervisor' | 'employee'>('employee');
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = await createInvitation(userId, companyId, email, role);
      setSuccess(`Invitation sent successfully. Token: ${token}`);
      setIsOpen(false);
      // Here you would typically send an email with the invitation link
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create invitation');
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        Invite User
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded">
            <h2 className="text-2xl font-bold mb-4 text-black">Invite User</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full p-2 mb-4 text-black"
                required
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 mb-4 text-black"
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'manager' | 'supervisor' | 'employee')}
                className="w-full p-2 mb-4 text-black"
                required
              >
                <option value="employee">Employee</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
              </select>
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsOpen(false)} className="mr-2 px-4 py-2 bg-gray-300 text-black rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}