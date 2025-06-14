import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
    Tabs,
    TabsHeader,
    Tab,
    Avatar
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSort } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Pagination from '../../components/Admin/Pagination'
import { statusUser, sortUsers } from '../../utils/User'
import ModalUser from "../../components/Admin/ModalUser";
import ListUsers from "../../components/Admin/ListUsers";

const TABS = [
    { label: "All", value: "all" },
    { label: "Admins", value: "admin" },
    { label: "Users", value: "user" },
];

const TABLE_HEAD = [
    { label: "User", width: "w-[35%]" },
    { label: "Nível", width: "w-[15%]" },
    { label: "Status", width: "w-[15%]" },
    { label: "Opções", width: "w-[25%]" }, // para actions/botões
];

const TABLE_ROWS = [
    {
        id: 1,
        name: "Luan Admin",
        email: "luanalvesnsr@gmail.com",
        role: "admin",
        last_login: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min atrás → online
        createdAt: "2024-02-01T10:00:00Z",
        updatedAt: "2024-06-01T10:00:00Z",
    },
    {
        id: 2,
        name: "Maria User",
        email: "maria@example.com",
        role: "user",
        last_login: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 min atrás → active
        createdAt: "2024-06-01T10:00:00Z",
        updatedAt: "2024-06-01T10:00:00Z",
    },
    {
        id: 3,
        name: "Carlos Sem Login Recente",
        email: "carlos@example.com",
        role: "user",
        last_login: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 dias atrás → inactive
        createdAt: "2024-04-01T10:00:00Z",
        updatedAt: "2024-04-01T10:00:00Z",
    },
    {
        id: 4,
        name: "Pedro Nunca Logou Recente",
        email: "pedro@example.com",
        role: "user",
        last_login: null, // nunca logou → active (criado recente)
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        name: "Ana Nunca Logou Antigo",
        email: "ana@example.com",
        role: "user",
        last_login: null, // nunca logou → inactive (criado faz tempo)
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 dias atrás
        updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 6,
        name: "Lucas Off Recent",
        email: "lucas@example.com",
        role: "admin",
        last_login: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 min atrás → offline (25min < X < 1h)
        createdAt: "2024-06-01T10:00:00Z",
        updatedAt: "2024-06-01T10:00:00Z",
    },
];

export default function Users() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState("");
    const [orderField, setOrderField] = useState(""); // "createdAt" ou "name"
    const [orderDirection, setOrderDirection] = useState("asc"); // "asc" ou "desc"
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [users, setUsers] = useState(statusUser(TABLE_ROWS));
    const usersWithStatus = statusUser(users);
    const [selectedUser, setSelectedUser] = useState(null);


    const handleAddUser = (newUser) => {
        setUsers(prev => [...prev, newUser]);
    };

    // Filtro + Busca
    let filteredRows = usersWithStatus
        .filter((row) =>
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.email.toLowerCase().includes(search.toLowerCase()) ||
            row.role.toLowerCase().includes(search.toLowerCase())
        )
        .filter((row) =>
            filter === "all" ? true : row.role.toLowerCase() === filter.toLowerCase()
        );

    if (orderField) {
        // Se tiver ordenação manual → usa util sortUsers
        filteredRows = sortUsers(filteredRows, orderField, orderDirection);
    } else {
        // Senão → aplica admin first
        filteredRows = filteredRows.sort((a, b) => {
            if (a.role === "admin" && b.role !== "admin") return -1;
            if (a.role !== "admin" && b.role === "admin") return 1;
            return 0;
        });
    }

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    // Resetar página quando search ou filter mudar:
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter, orderField, orderDirection]);

    return (
        <>
            <Card className="h-full w-full mt-30 card card-table-users">
                <CardHeader floated={false} shadow={false} className="p-6 card rounded-none">
                    <div className="card mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Usuários
                            </Typography>
                            <Typography variant="small" className="text-gray-500">
                                Gerencie sua equipe e permissões
                            </Typography>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">

                            <Button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setShowAddModal(true);
                                }}
                                size="sm"
                                className="btn-add-user flex items-center gap-2">
                                <FontAwesomeIcon className='w-4 h-4' icon={faUserPlus} size="sm" />
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    <div className="card options-table gap-4">

                        <div className="fitlers" >
                            <div className="tabs-filter relative w-max bg-gray-200 p-1 rounded-lg overflow-hidden">
                                {/* Slider */}
                                <span
                                    className="slider absolute w-[90px] rounded-lg bg-white shadow transition-transform duration-300"
                                    style={{
                                        transform: `translateX(${TABS.findIndex(tab => tab.value === filter) * 100}%)`,
                                    }}
                                ></span>

                                {/* Tabs */}
                                <Tabs value={filter}>
                                    <TabsHeader className="relative z-20 flex bg-transparent p-0">
                                        {TABS.map(({ label, value }) => (
                                            <Tab
                                                key={value}
                                                value={value}
                                                onClick={() => setFilter(value)}
                                                className="tab-opt relative z-10 w-[90px] h-[35px] text-center flex items-center justify-center cursor-pointer"
                                            >
                                                {label}
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>


                        </div>

                        <div className="input-search">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                className="input"
                                id='search'
                            />

                            <label htmlFor="search">{search.trim().length === 0 ? 'Procurar' : ''}</label>

                        </div>
                    </div>

                    <div className="input-order">
                        <label htmlFor="order" className="mr-2">
                            <FontAwesomeIcon icon={faSort} />
                        </label>
                        <select
                            id="order"
                            value={`${orderField}-${orderDirection}`}
                            onChange={(e) => {
                                const [field, direction] = e.target.value.split("-");
                                setOrderField(field || "");
                                setOrderDirection(direction || "asc");
                            }}
                            className="order-select p-1"
                        >
                            <option value="">Sem ordenação</option>
                            <option value="createdAt-desc">Data de cadastro (Mais recente primeiro)</option>
                            <option value="createdAt-asc">Data de cadastro (Mais antigo primeiro)</option>
                            <option value="name-asc">Nome A-Z</option>
                            <option value="name-desc">Nome Z-A</option>
                        </select>
                    </div>

                </CardHeader>

                <CardBody className="relative flex flex-col w-full h-full ">
                    <table className="table-users w-full table-fixed text-left text-gray-700 shadow-md rounded-xl bg-clip-border">
                        <thead className="hidden md:table-header-group ">
                            <tr  >
                                {TABLE_HEAD.map(({ label, width }) => (
                                    <th
                                        key={label}
                                        className={`${width} p-4 row-thead-table`}
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none "
                                            style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' }}
                                        >
                                            {label}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className=" shadow-md ">
                            <ListUsers
                                users={paginatedRows}
                                onOpenEdit={(user) => {
                                    setSelectedUser(user);
                                    setShowAddModal(true);
                                }}
                            />
                        </tbody>
                    </table>
                </CardBody>

                <CardFooter className="flex items-center justify-between p-4">
                    <div>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            Pagina {currentPage} de {totalPages || 1}
                        </Typography>

                        <div className='options-table-extra'>
                            <div className='group-select' >
                                <span>Mostrando</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        //setCurrentPage(1); // opcional: volta pra página 1 ao mudar o per page
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span>por pagina</span>
                            </div>
                        </div>

                    </div>
                    <div className="flex gap-2">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </CardFooter>
            </Card>

            <ModalUser
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAddUser={(newUser) => setUsers([...users, newUser])}
                onEditUser={(updatedUser) => {
                    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                }}
                existingUsers={users}
                user={selectedUser}
            />
        </>
    );
}
