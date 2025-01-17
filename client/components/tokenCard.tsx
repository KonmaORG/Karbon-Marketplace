import React from 'react'

interface props {
    token: string;
    qty: number;
}

export default function TokenCard({ token, qty }: props) {
    return (
        <div>
            {token + ":" + qty}
        </div>
    )
}
