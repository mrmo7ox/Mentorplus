import React, { useEffect, useState } from 'react';
import {me} from '../utils/authutils.js'
const fxSecondaryBgTransparent = 'rgba(30,30,30,0.8)'; 
const fxAccentGreen = '#00FF99'; 


function Header({ pageTitle, userRole }) {
    const [data, setData] = useState({ first_name: '', last_name: '' });
        useEffect(() => {
            async function fetchData() {
                const userData = await me();
                console.log(
                    "fdsfsd",userData);
                setData(userData || { first_name: '', last_name: '' });
            }
            fetchData();
        }, []);

    return React.createElement(
        'header',
        {
            className: 'flex-shrink-0 h-20 flex items-center justify-between px-6 border-b border-gray-800',
            style: {
                backgroundColor: fxSecondaryBgTransparent,
                backdropFilter: 'blur(10px)',
            },
        },
        [
            React.createElement(
                'h1',
                { className: 'text-xl font-bold text-white', key: 'pageTitle' },
                pageTitle
            ),
            React.createElement(
                'div',
                { className: 'flex items-center gap-4', key: 'userBlock' },
                [
                    React.createElement(
                        'div',
                        { className: 'text-right', key: 'userText' },
                        [
                            React.createElement(
                                'span',
                                {
                                    className: 'text-white font-semibold hidden sm:block',
                                    key: 'userName',
                                },
                                `${data.first} ${data.last}`
                            ),
                            React.createElement(
                                'span',
                                {
                                    className: 'text-xs font-bold uppercase',
                                    style: { color: fxAccentGreen },
                                    key: 'userRole'
                                },
                                userRole
                            )
                        ]
                    ),
                    React.createElement(
                        'div',
                        {
                            className: 'w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center',
                            key: 'avatar'
                        },
                        React.createElement(
                            'span',
                            { className: 'text-2xl', style: { color: fxAccentGreen } },
                            '👤'
                        )
                    )
                ]
            )
        ]
    );
}

export default Header;