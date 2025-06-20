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
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSort, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useMemo } from "react";
import Pagination from '../../components/Admin/Pagination';
import { statusUser, sortUsers } from '../../utils/User';
import ModalUser from "../../components/Admin/ModalUser";
import ListUsers from "../../components/Admin/ListUsers";
import { apiHttp } from "../../utils/api";
import { User } from "../../types/enum";
import { closeToast, showConfirm, showLoadingToast } from "../../utils/swal";
import { useAuthStore } from "../../stores/useAuthStore";
import { MomentMessage, useMessageStore } from '../../stores/useMessageStore'

const TABS = [
    { label: "All", value: "all" },
    { label: "Admins", value: "admin" },
    { label: "Users", value: "user" },
];

const TABLE_HEAD = [
    { label: "User", width: "w-[35%]" },
    { label: "Nível", width: "w-[15%]" },
    { label: "Status", width: "w-[15%]" },
    { label: "Opções", width: "w-[25%]" },
];

export default function AdminUsers() {
    // State management
    const { user } = useAuthStore();
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState<string>("");
    const [orderField, setOrderField] = useState<string>("");
    const [orderDirection, setOrderDirection] = useState<string>("asc");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const { setMessage } = useMessageStore()

    // API data
    const { removeUser, fetchUsers, loading, error } = apiHttp();
    const [users, setUsers] = useState<User[]>([]);

    // Fetch users on component mount
    useEffect(() => {
        const loadUsers = async () => {
            try {

                const { success, ...usersData } = await fetchUsers();
                const usersArray = success ? Object.values(usersData) as User[] : [];
                setUsers(usersArray);
            } catch (err) {
                console.error("Failed to load users:", err);
                setUsers([]);
            }
        };

        loadUsers();
    }, []);

    useEffect(() => {
        if (loading) {
            showLoadingToast();
        } else {
            closeToast();
        }
    }, [loading]);

    // Process users data with useMemo for optimization
    const { paginatedUsers, totalPages, totalUsers } = useMemo(() => {
        const usersWithStatus = users.length > 0 ? statusUser(users) : [];

        let filteredUsers = usersWithStatus.filter(user =>
            (
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.role.toLowerCase().includes(search.toLowerCase())
            ) &&
            (filter === "all" || user.role.toLowerCase() === filter.toLowerCase()) &&
            (statusFilter === "all" || user.status?.toLowerCase() === statusFilter.toLowerCase())
        );

        filteredUsers = orderField
            ? sortUsers(filteredUsers, orderField, orderDirection)
            : filteredUsers.sort((a, b) => {
                if (a.role === "admin" && b.role !== "admin") return -1;
                if (a.role !== "admin" && b.role === "admin") return 1;
                return 0;
            });

        const totalItems = filteredUsers.length;
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        const paginatedUsers = filteredUsers.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        );

        return { paginatedUsers, totalPages, totalUsers: totalItems };
    }, [users, search, filter, statusFilter, orderField, orderDirection, currentPage, rowsPerPage]);


    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter, orderField, orderDirection]);

    // Handlers
    const handleAddUser = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    };

    const handleEditUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleConfirmDelete = async (id: string) => {

        if (loading) return;

        try {


            const result = await showConfirm("Deseja deletar?", "Essa ação é permanente.");

            if (result.isConfirmed) {
                const response = await removeUser(id, {
                    id: user?.id ?? '',
                    role: user?.role ?? 'user'
                });


                if (!response?.success) {

                    setMessage({
                        'type': 'error',
                        'message': response?.message || "Erro ao deletar usuário!"
                    } as MomentMessage);


                } else {

                    setUsers(prev => prev.filter(u => u.id !== id));

                    setMessage({
                        'type': 'success',
                        'message': "Usuário deletado com sucesso!"
                    } as MomentMessage);
                }


            }

            return;


        } catch (error) {

            setMessage({
                'type': 'error',
                'message': `${error || 'Desculpe, tente novamente mais tarde'}`
            } as MomentMessage);

        } finally {

        }

    }

    const handleSortChange = (value: string) => {
        const [field, direction] = value.split("-");
        setOrderField(field || "");
        setOrderDirection(direction || "asc");
    };


    if (error) return <div>Error loading users: {error}</div>;


    return (
        <>
            <Card
                // Card principal, sem sombra e sem float
                shadow={false}
                className="max-w-[1100px] mx-auto h-full w-full mt-30 card card-table-users"
            >
                <CardHeader
                    // CardHeader NÃO usa shadow/floated, só className
                    className="p-6 card rounded-none"
                >
                    {/* Título e subtítulo */}
                    <div className="card mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Usuários
                            </Typography>
                            <Typography variant="small" className="text-gray-500">
                                Gerencie sua equipe e permissões
                            </Typography>
                        </div>

                        {/* Botão para abrir modal de adicionar */}
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setShowAddModal(true);
                                }}
                                size="sm"
                                className="btn-add-user flex items-center gap-2"
                            >
                                <FontAwesomeIcon className="w-4 h-4" icon={faUserPlus} />
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    {/* Filtros: Tabs + Busca + Ordenação */}
                    <div className="card options-table gap-4">
                        {/* Tabs de filtro de role */}
                        <div className="fitlers w-full">
                            <div className="tabs-filter relative w-max bg-gray-200 p-1 rounded-lg overflow-hidden">
                    
                                {/* Lista de Tabs */}
                                <Tabs value={filter}>
                                    <TabsHeader className="relative z-20 flex bg-transparent p-0">
                                        {TABS.map(({ label, value }) => (
                                            <Tab
                                                key={value}
                                                value={value}
                                                onClick={() => setFilter(value)}
                                                className="tab-opt relative z-10 w-[90px] sm:w-[70px] h-[35px] text-center flex items-center justify-center cursor-pointer"
                                            >
                                                {label}
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>
                        </div>

                        {/* Campo de busca */}
                        <div className="input-search">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                id="search"
                                className="input"
                                crossOrigin=""
                            />
                            <label htmlFor="search">
                                {search.trim().length === 0 ? 'Procurar' : ''}
                            </label>
                        </div>
                    </div>

                    <div className="block md:flex flex-wrap content-start gap-5" >
                        {/* Select de ordenação */}
                        <div className="input-order">
                            <div className="flex">
                                <label htmlFor="order">
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
                            <small>Ordenar</small>
                        </div>

                        {/* Select status */}
                        <div className="input-order">
                            <div className="flex">
                                <label htmlFor="status">
                                    <FontAwesomeIcon icon={faFilter} />
                                </label>
                                <select
                                    id="status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="order-select p-1"
                                >
                                    <option value="all">Todos</option>
                                    <option value="inactive">Inativo</option>
                                    <option value="active">Ativo</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                            <small>Filtar por status</small>
                        </div>

                    </div>

                </CardHeader>

                {/* Corpo da tabela */}
                <CardBody className="relative p-0 flex flex-col w-full h-full">
                    <table className="table-users w-full table-fixed text-left text-gray-700 shadow-md rounded-xl bg-clip-border">
                        <thead className="hidden md:table-header-group">
                            <tr>
                                {TABLE_HEAD.map(({ label, width }) => (
                                    <th key={label} className={`${width} p-4 row-thead-table`}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none"
                                            style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' }}
                                        >
                                            {label}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="shadow-md">
                            <ListUsers
                                users={paginatedUsers}
                                onConfirmDelete={(id) => {
                                    handleConfirmDelete(id);
                                }}
                                onOpenEdit={(user) => {
                                    setSelectedUser(user);
                                    setShowAddModal(true);
                                }}
                            />
                        </tbody>
                    </table>
                </CardBody>

                {/* Rodapé com paginação e rowsPerPage */}
                <CardFooter className="flex-row flex-col-reverse sm:flex-row items-center justify-between p-4">
                    <div className="relative grid justify-start sm:flex sm:justify-between">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            Página {currentPage} de {totalPages || 1}
                        </Typography>

                        <div className="options-table-extra">
                            <div className="group-select">
                                <span>Mostrando</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span>por página</span>
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

            {/* Modal para criar/editar user */}
            <ModalUser
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAddUser={(newUser) => setUsers([...users, newUser])}
                onEditUser={(updatedUser) => {
                    setUsers(prev =>
                        prev.map(u => u.id === updatedUser.id ? updatedUser : u)
                    );
                }}
                existingUsers={users}
                user={selectedUser}
            />
        </>

    );
}
