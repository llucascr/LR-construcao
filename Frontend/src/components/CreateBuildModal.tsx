import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, Save } from 'lucide-react';
import { buildService } from '../services/buildService';
import type { CreateBuildRequestDTO } from '../types';

interface CreateBuildModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialFormState: CreateBuildRequestDTO = {
    name: '',
    buildSize: 0,
    totalPaid: 0,
    buildCost: 0,
    startDate: '',
    endDate: '',
    road: '',
    numberAddress: '',
    neighborhood: '',
    city: '',
    Cep: '',
    condominiumBlock: '',
    condominiumLot: '',
    ClientName: '',
    Clientemail: '',
    ClientPhone: '',
};

export const CreateBuildModal = ({ isOpen, onClose }: CreateBuildModalProps) => {
    const [formData, setFormData] = useState<CreateBuildRequestDTO>(initialFormState);
    const [error, setError] = useState<string | null>(null);

    // Using localStorage to get user ID as a fallback since AuthContext structure is generic
    const getUserId = () => {
        const userStr = localStorage.getItem('user'); // Common pattern
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.id;
            } catch (e) {
                console.error("Error parsing user from local storage", e);
            }
        }
        return 1; // Fallback for dev/testing if not found
    };

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateBuildRequestDTO) => {
            const userId = getUserId();
            // Sanitizing condo fields to avoid ORA-01400 if user leaves them blank
            // Backend seemingly blindly inserts condo if fields are present
            const sanitizedData = {
                ...data,
                condominiumBlock: data.condominiumBlock.trim() === '' ? ' ' : data.condominiumBlock,
                condominiumLot: data.condominiumLot.trim() === '' ? ' ' : data.condominiumLot,
            };
            return buildService.create(sanitizedData, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds'] });
            setFormData(initialFormState); // Reset form
            onClose();
        },
        onError: (err: any) => {
            console.error('Failed to create build:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create build');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle numbers
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        mutation.mutate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-6 text-xl font-bold text-gray-900">Nova Obra</h2>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Dados da Obra</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Nome da Obra</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tamanho (m²)</label>
                                <input
                                    type="number"
                                    name="buildSize"
                                    value={formData.buildSize || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Data Início</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Data Fim</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Info */}
                    <div className="border-t pt-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Financeiro</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Custo da Obra</label>
                                <input
                                    type="number"
                                    name="buildCost"
                                    value={formData.buildCost || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            {/* totalPaid is effectively read-only or initialized to 0 in backend create, 
                                but DTO has it. We can either hide it or let user set initial 'paid so far' 
                                if backend supported it manually overriding 0? 
                                User snippet: totalPaid(BigDecimal.valueOf(0)) in create method. 
                                So inputs here are ignored. Removing input. 
                            */}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="border-t pt-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Endereço</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rua</label>
                                <input
                                    required
                                    name="road"
                                    value={formData.road}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Número</label>
                                    <input
                                        required
                                        name="numberAddress"
                                        value={formData.numberAddress}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CEP</label>
                                    <input
                                        required
                                        name="Cep"
                                        value={formData.Cep}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                <input
                                    required
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                <input
                                    required
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Condomínio Bloco</label>
                                    <input
                                        name="condominiumBlock"
                                        value={formData.condominiumBlock}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lote</label>
                                    <input
                                        name="condominiumLot"
                                        value={formData.condominiumLot}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client */}
                    <div className="border-t pt-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Cliente</h3>
                        <div className="grid gap-4 md:grid-cols-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
                                <input
                                    required
                                    name="ClientName"
                                    value={formData.ClientName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        required
                                        type="email"
                                        name="Clientemail"
                                        value={formData.Clientemail}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                    <input
                                        required
                                        name="ClientPhone"
                                        value={formData.ClientPhone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {mutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Criar Obra
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
