import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, User as UserIcon, Phone, Mail, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { clientService } from '../services/clientService';
import { dashboardService } from '../services/dashboardService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import type { Client, User, ClientInput } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatPhoneNumber } from '../utils/formatters';

export const Clients = () => {
    const { token } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 11;

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<ClientInput>({
        name: '',
        email: '',
        phone: ''
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [clientsResponse, totalResponse, usersResponse] = await Promise.all([
                clientService.getClients(currentPage, pageSize),
                dashboardService.getTotalClients(),
                userService.getUsers()
            ]);

            // Backend returns List<Client> directly, not Page<Client>
            const content = Array.isArray(clientsResponse) ? clientsResponse : [];
            const totalE = typeof totalResponse === 'number' ? totalResponse : 0;
            const totalP = Math.ceil(totalE / pageSize);

            console.log('Processed Clients Content:', content);
            console.log('Pagination info:', { totalE, totalP, currentPage });

            setClients(content);
            setTotalElements(totalE);
            setTotalPages(totalP);

            const userList = (usersResponse as { content?: User[] }).content || (Array.isArray(usersResponse) ? usersResponse : []);

            const userMap = (Array.isArray(userList) ? userList : []).reduce((acc: Record<number, User>, user: User) => {
                acc[user.id] = user;
                return acc;
            }, {} as Record<number, User>);

            setUsers(userMap);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleOpenModal = (client?: Client) => {
        console.log('Opening modal with client:', client);
        if (client) {
            setEditingId(client.id);
            setFormData({
                name: client.name,
                email: client.email,
                phone: client.phone
            });
        } else {
            console.log('No client provided, switching to Create mode');
            setEditingId(null);
            setFormData({ name: '', email: '', phone: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form. EditingId:', editingId, 'FormData:', formData);

        try {
            setIsSubmitting(true);

            if (editingId) {
                console.log('Mode: EDIT');
                // Determine changed fields
                const originalClient = clients.find(c => c.id === editingId);
                if (!originalClient) {
                    console.error('Original client not found for id:', editingId);
                    return;
                }

                const changedFields: Partial<ClientInput> = {};

                // Compare fields
                if (formData.name.trim() !== originalClient.name) changedFields.name = formData.name;
                if (formData.email.trim() !== originalClient.email) changedFields.email = formData.email;
                if (formData.phone.trim() !== originalClient.phone) changedFields.phone = formData.phone;

                console.log('Changed fields:', changedFields);

                // Only call update if there are changes
                if (Object.keys(changedFields).length > 0) {
                    await clientService.update(changedFields, editingId);
                } else {
                    console.log('No changes detected, skipping update');
                }
            } else {
                console.log('Mode: CREATE');

                // Try to find current user from the loaded users list
                // No longer need to lookup user ID from list
                // Backend now accepts userEmail directly
                const userEmail = token?.email;

                if (!userEmail) {
                    console.error('Token email is missing! Cannot create client.');
                    alert('Erro: Email do usuário não encontrado. Faça login novamente.');
                    return;
                }

                console.log('Creating client with User Email:', userEmail);
                await clientService.create(formData, userEmail);
            }

            // Close modal, reset form, and refresh list
            setIsModalOpen(false);
            setFormData({ name: '', email: '', phone: '' });
            setEditingId(null);
            await fetchData(); // Ensure fetchData completes
        } catch (error) {
            console.error('Failed to save client', error);
            // Could add toast notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                    <p className="text-gray-500 mt-1">Gerencie sua base de clientes</p>
                </div>
                <Button
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => handleOpenModal()}
                >
                    Novo Cliente
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="max-w-md">
                        <Input
                            placeholder="Buscar clientes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Carregando clientes...</div>
                    ) : filteredClients.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Nenhum cliente encontrado.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 font-medium text-gray-600">
                                <tr>
                                    <th className="px-6 py-3">Nome</th>
                                    <th className="px-6 py-3 hidden sm:table-cell">Contato</th>
                                    <th className="px-6 py-3 hidden md:table-cell">Criado Por</th>
                                    <th className="px-6 py-3 hidden lg:table-cell">Criado em</th>
                                    <th className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">{client.name}</div>
                                                    <div className="text-xs text-gray-500 sm:hidden">{client.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 hidden sm:table-cell">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2 text-gray-600 text-xs">
                                                    <Mail className="w-3 h-3" />
                                                    {client.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <Phone className="w-3 h-3" />
                                                    {formatPhoneNumber(client.phone)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-100 p-1 rounded-full">
                                                    <UserIcon className="w-3 h-3 text-gray-500" />
                                                </div>
                                                <span className="text-gray-700 text-xs">
                                                    {users[client.user_id]?.name || 'Usuário Desconhecido'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 hidden lg:table-cell text-gray-500 text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(client.createAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenModal(client)}
                                                className="h-8 text-xs"
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>


                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-medium">{clients.length}</span> de <span className="font-medium">{totalElements}</span> resultados
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            leftIcon={<ChevronLeft className="w-4 h-4" />}
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-gray-600 font-medium px-2">
                            Página {currentPage + 1} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Editar Cliente" : "Novo Cliente"}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {editingId ? "Salvar Alterações" : "Salvar Cliente"}
                        </Button>
                    </>
                }
            >
                <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome"
                        placeholder="João Silva"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Phone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                </form>
            </Modal>
        </div >
    );
};
