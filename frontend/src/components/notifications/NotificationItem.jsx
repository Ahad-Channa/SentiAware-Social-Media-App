import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkRead }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onMarkRead(notification._id);
        if (notification.relatedId) {
            navigate(`/profile/${notification.relatedId._id}`);
        }
    };

    return (
        <div
            className={`p-3 border-b border-gray-100 hover:bg-gray-50 flex items-start space-x-3 transition-colors cursor-pointer ${!notification.read ? 'bg-purple-50' : ''}`}
            onClick={handleClick}
        >
            <div className="flex-shrink-0">
                {notification.relatedId && notification.relatedId.profilePic ? (
                    <img
                        src={notification.relatedId.profilePic}
                        alt={notification.relatedId.name}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                    />
                ) : (
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!notification.read ? 'bg-purple-200' : 'bg-gray-200'}`}>
                        <span className="text-xs font-bold text-gray-600">
                            {notification.relatedId?.name?.[0] || "S"}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <p className={`text-sm ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {notification.message}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
            </div>
            {/* Read Indicator Dot */}
            {!notification.read && (
                <div className="mt-2 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></div>
            )}
        </div>
    );
};

export default NotificationItem;
