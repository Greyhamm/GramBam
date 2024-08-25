import React from 'react';
import { Invitation, NotificationDropdownProps } from '@/lib';



const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ invitations, onAccept, onDecline }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2">
        <h3 className="text-lg font-semibold text-gray-900 px-4 py-2">Notifications</h3>
        {invitations.length === 0 ? (
          <p className="text-gray-500 px-4 py-2">No new notifications</p>
        ) : (
          invitations.map((invitation) => (
            <div key={invitation.id} className="px-4 py-2 hover:bg-gray-100">
              <p className="text-sm text-gray-800">
                You have been invited to join {invitation.company_name} as {invitation.role}.
              </p>
              <div className="mt-2">
                <button
                  onClick={() => onAccept(invitation.token)}
                  className="mr-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => onDecline(invitation.token)}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;