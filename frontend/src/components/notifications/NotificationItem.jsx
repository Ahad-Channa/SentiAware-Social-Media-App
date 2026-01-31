import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onMarkRead }) => {
    return (
        <div
            className={`p-3 border-b border-gray-100 hover:bg-gray-50 flex items-start space-x-3 transition-colors ${!notification.read ? 'bg-purple-50' : ''}`}
            onClick={() => onMarkRead(notification._id)}
        >
            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-purple-500' : 'bg-transparent'}`}></div>

            <div className="flex-1">
                <p className={`text-sm ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {notification.message}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
            </div>
        </div>
    );
};

export default NotificationItem;
