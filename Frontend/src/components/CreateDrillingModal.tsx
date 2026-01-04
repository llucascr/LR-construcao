import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, Plus } from 'lucide-react';
import { drillingService } from '../services/drillingService';
import type { DrillingInput } from '../types';

interface CreateDrillingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialFormState: DrillingInput = {
    name: '',
    drillSize: 0,
    depth: 0,
    drillQuatities: 1,
    priceMeter: 0,
    invoice: false,
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

export const CreateDrillingModal = ({ isOpen, onClose }: CreateDrillingModalProps) => {
    // Hardcoded user ID for testing/demo as backend doesn't easily expose ID
    // In production, this should come from AuthContext
    const TEST_USER_ID = 1;

    const [formData, setFormData] = useState<DrillingInput>(initialFormState);
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: DrillingInput) => drillingService.create(data, TEST_USER_ID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drillings'] });
            setFormData(initialFormState);
            onClose();
        },
        onError: (err: any) => {
            console.error('Failed to create drilling:', err);
            console.log('Error Response Data:', err.response?.data);
            console.log('Error Response Status:', err.response?.status);
            setError(err.response?.data?.message || err.message || 'Failed to create service');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle boolean checkbox
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

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

                <h2 className="mb-6 text-xl font-bold text-gray-900">Novo Serviço de Perfuração</h2>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center space-x-3 pt-6">
                            <input
                                type="checkbox"
                                name="invoice"
                                id="invoice"
                                checked={formData.invoice}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="invoice" className="text-sm font-medium text-gray-700">Emitir Nota Fiscal</label>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Diâmetro Broca</label>
                            <input
                                type="number"
                                name="drillSize"
                                value={formData.drillSize || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profundidade (m)</label>
                            <input
                                type="number"
                                name="depth"
                                value={formData.depth || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                            <input
                                type="number"
                                name="drillQuatities"
                                value={formData.drillQuatities || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preço/m</label>
                            <input
                                type="number"
                                name="priceMeter"
                                value={formData.priceMeter || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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
                            <div className="md:col-span-1 grid grid-cols-2 gap-2">
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
                                        required
                                        name="condominiumBlock"
                                        value={formData.condominiumBlock}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lote</label>
                                    <input
                                        required
                                        name="condominiumLot"
                                        value={formData.condominiumLot}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

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
                            <div className="grid grid-cols-2 gap-4">
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

                    <div className="flex justify-end space-x-3 pt-6">
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
                                <Plus className="mr-2 h-4 w-4" />
                            )}
                            Criar Serviço
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
