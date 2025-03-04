// Header.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars, faCog, faSearch, faCheck, faUserFriends, faGlobe, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import '../Header.css';

const Header = ({ usersInRoom, onSearchClick, onQueueClick, showCountdown, countdown }) => {
    const { roomId } = useParams(); // Lấy roomId từ URL
    const [showPopup, setShowPopup] = useState(false);
    const [showUserList, setShowUserList] = useState(false); // Trạng thái để hiển thị danh sách người dùng
    const navigate = useNavigate();

    const handleLeaveClick = () => {
        setShowPopup(true); // Hiển thị popup khi bấm nút X
    };

    const handleLeaveConfirm = async () => {
        setShowPopup(false);
        const token = localStorage.getItem('token');

        // Giải mã JWT để lấy username từ sub
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const username = tokenPayload.sub;

        try {
            console.log("Sending DELETE request to server...");

            const response = await fetch(`https://colkidclub-hutech.id.vn/api/rooms/${roomId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ username }) // Gửi username trong body
            });

            // Kiểm tra xem yêu cầu DELETE có thành công không
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server responded with status: ${response.status}, message: ${errorText}`);
            }

            console.log("Room deleted successfully");
            navigate('/home');
        } catch (error) {
            console.error('Error deleting room:', error);
            alert('Không thể xóa phòng. Vui lòng thử lại.');
        }
    };

    const handleStay = () => {
        setShowPopup(false); // Ẩn popup khi chọn "Stay"
    };

    const toggleUserList = () => {
        setShowUserList(!showUserList); // Toggle hiển thị danh sách người dùng
    };

    return (
        <div className="headerr">
            <div className="top-bar">
                <div className="item" onClick={handleLeaveClick}>
                    <FontAwesomeIcon icon={faTimes} className="icon" />
                </div>
                <div className="item">
                    <FontAwesomeIcon icon={faBars} className="icon" />
                </div>
                <div className="item">
                    <FontAwesomeIcon icon={faCog} className="icon" />
                </div>
                <div className="item" onClick={onSearchClick}>
                    <FontAwesomeIcon icon={faSearch} className="icon" />
                </div>

                {/* Placeholder để giữ khoảng trống */}
                <div className="item placeholder"></div>

                {/* Logo/Countdown được position absolute */}
                <div className="item logo">
                    {showCountdown ? (
                        <div className="countdown-container">
                            <svg viewBox="0 0 40 40">
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="18"
                                    fill="none"
                                    stroke="#666"
                                    strokeWidth="2"
                                />
                                <text
                                    x="20"
                                    y="20"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="#fff"
                                    fontSize="20"
                                    fontWeight="bold"
                                >
                                    {countdown}
                                </text>
                            </svg>
                        </div>
                    ) : (
                            <img src="https://i.imgur.com/Mwphh0y.png" alt="Cinemate" />
                    )}
                </div>

                <div className="item" onClick={onQueueClick}>
                    <FontAwesomeIcon icon={faCheck} className="icon" />
                </div>
                <div className="item">
                    <FontAwesomeIcon icon={faUserFriends} className="icon" />
                </div>
                <div className="item">
                    <FontAwesomeIcon icon={faGlobe} className="icon" />
                </div>
                <div className="item" onClick={toggleUserList}>
                    <FontAwesomeIcon icon={faUsers} className="icon" />
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Leave the CINEMATE?</p>
                        <div className="popup-buttons">
                            <button className="popup-button" onClick={handleStay}>Stay</button>
                            <button className="popup-button" onClick={handleLeaveConfirm}>Leave</button>
                        </div>
                    </div>
                </div>
            )}

            {showUserList && (
                <div className="user-list">
                    <div className="user-list-header">
                        <p>Users in Room</p>
                    </div>
                    <ul>
                        {usersInRoom.map((user, index) => (
                            <li key={index}>
                                <img src="https://i.imgur.com/Tr9qnkI.jpeg" alt="Avatar" className="user-avatar" />
                                <span>{user}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Header;
