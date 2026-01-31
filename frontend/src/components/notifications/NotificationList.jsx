import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead } from '../../redux/notificationSlice';
import NotificationItem from './NotificationItem';

const NotificationList = ({ onClose }) => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleMarkRead = (id) => {
        dispatch(markRead(id));
    };

    if (loading && items.length === 0) {
        return <div className="p-4 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error loading notifications</div>;
    }

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
            <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                {onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        &times;
                    </button>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No notifications yet
                    </div>
                ) : (
                    items.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onMarkRead={handleMarkRead}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationList;
