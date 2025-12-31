import { useState, useEffect } from 'react';
import { Search, Plus, User as UserIcon, Phone, Mail, Calendar } from 'lucide-react';
import { clientService } from '../services/clientService';
import { userService } from '../services/userService';
import type { Client, User, ClientInput } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<ClientInput>({
        name: '',
        email: '',
        phone: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [clientsResponse, usersResponse] = await Promise.all([
                clientService.getClients(),
                userService.getUsers()
            ]);

            console.log('API Response (Clients):', clientsResponse);

            let clientList: Client[] = [];
            if (Array.isArray(clientsResponse)) {
                clientList = clientsResponse;
            } else if (clientsResponse && (clientsResponse as any).content) {
                clientList = (clientsResponse as any).content;
            }

            console.log('Processed Client List:', clientList);

            if (clientList.length > 0) {
                console.log('First Client Structure:', clientList[0]);
            }

            setClients(clientList);

            const userList = (usersResponse as any).content ? (usersResponse as any).content : usersResponse;

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
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                await clientService.create(formData);
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
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-500 mt-1">Manage your client base</p>
                </div>
                <Button
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => handleOpenModal()}
                >
                    New Client
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="max-w-md">
                        <Input
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading clients...</div>
                    ) : filteredClients.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No clients found.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 font-medium text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Contact</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Created By</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Date Added</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{client.name}</div>
                                                    <div className="text-xs text-gray-500 sm:hidden">{client.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {client.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {client.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-100 p-1.5 rounded-full">
                                                    <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                                                </div>
                                                <span className="text-gray-700">
                                                    {users[client.user_id]?.name || 'Unknown User'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(client.create_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenModal(client)}
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
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Client" : "New Client"}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {editingId ? "Save Changes" : "Save Client"}
                        </Button>
                    </>
                }
            >
                <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        placeholder="John Doe"
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
        </div>
    );
};
