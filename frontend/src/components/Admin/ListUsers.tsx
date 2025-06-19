import React, { useState } from "react";
import {
    Typography,
    Avatar,
    Button
} from "@material-tailwind/react";
import LabelStatus from './LabelStatus'
import { useAuthStore } from "../../stores/useAuthStore";
import Gravatar from 'react-gravatar'

export default function Users({
    users,
    onOpenEdit,
    onConfirmDelete
}) {
    const { user } = useAuthStore();
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (name) => {
        if (window.innerWidth < 768) {
            setExpandedRow((prev) => (prev === name ? null : name));
        }
    };

    return (
        <>
            {users.map(({ id, name, email, role, status }) => (

                <React.Fragment key={id}>
                    <tr
                        key={name}
                        className="md:table-row row-table"
                    >
                        {/* User cell, clickable */}
                        <td className="p-4 cursor-pointer w-full" onClick={() => toggleRow(name)}>
                            <div className="flex items-center gap-3 w-full">

                                <Gravatar
                                    email={email}
                                    size={50}
                                    style={{ width: 50, height: 50, borderRadius: 100 }}
                                    rating="pg"
                                    default="monsterid"
                                />

                                {/* Container que divide NOME + STATUS só no mobile */}
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-sm font-medium text-blue-gray-900">
                                            {name}
                                            {user?.id === id && (
                                                <span
                                                    style={{ fontStyle: 'italic', marginLeft: 3, fontSize: 14, fontWeight: 600, color: '#608795' }}
                                                >
                                                    (Sou eu)
                                                </span>
                                            )}
                                        </span>

                                        {/* Status só no mobile */}
                                        <span className="ml-2 md:hidden shrink-0">
                                            <LabelStatus status={status} />
                                        </span>
                                    </div>

                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-xs"
                                    >
                                        {email}
                                    </Typography>
                                </div>
                            </div>
                        </td>

                        {/* Desktop columns */}
                        <td className="p-4 hidden md:table-cell">{role}</td>
                        <td className="p-4 hidden md:table-cell">
                            <LabelStatus status={status} />
                        </td>
                        <td className="td-buttons hidden md:table-cell m-0">
                            <div className='group-buttons-table'>
                                {user?.id !== id && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                onOpenEdit({ id, name, email, role });
                                            }}
                                            className='btn-edit'
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                onConfirmDelete(id);
                                            }}
                                            className='btn-remove'
                                        >
                                            Excluir
                                        </Button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>

                    {/* Mobile dropdown row */}
                    {expandedRow === name && (
                        <tr className="md:hidden">
                            <td colSpan={5} className="p-2 bg-gray-50 card">
                                <div className="space-y-2 dropdown-user-option">
                                    <Typography variant="small" >
                                        <strong>Role:</strong> {role}
                                    </Typography>
                                    <Typography variant="small" >
                                        <strong>Status:</strong>{" "}
                                        <LabelStatus status={status} />
                                    </Typography>

                                    <div className='group-buttons-table'>
                                        {user?.id !== id && (
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        onOpenEdit({ id, name, email, role });
                                                    }}
                                                    className='btn-edit'
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        onConfirmDelete(id);
                                                    }}
                                                    className='btn-remove'
                                                >
                                                    Excluir
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}

        </>
    );
}
