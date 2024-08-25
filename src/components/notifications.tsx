// src/components/Notifications.tsx
import React from 'react';
import { acceptInvitation } from '@/actions';
import { Invitation, NotificationsProps } from '@/lib';



export default function Notifications({ invitations, userId, onAccept }: NotificationsProps) {
  const handleAccept = async (token: string) => {
    try {
      await acceptInvitation(token, userId);
      onAccept(); // Refresh the notifications
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {invitations.length === 0 ? (
        <p>No pending invitations.</p>
      ) : (
        <ul>
          {invitations.map((invitation) => (
            <li key={invitation.id} className="mb-4 p-4 border rounded">
              <p>You have been invited to join {invitation.company_name} as {invitation.role}.</p>
              <button 
                onClick={() => handleAccept(invitation.token)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Accept Invitation
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}