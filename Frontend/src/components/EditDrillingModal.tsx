import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, Save } from 'lucide-react';
import { drillingService } from '../services/drillingService';
import type { DrillingInput, Drilling, PaymentStatus } from '../types';

interface EditDrillingModalProps {
    isOpen: boolean;
    onClose: () => void;
    drilling: Drilling | null; // The item to edit
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

export const EditDrillingModal = ({ isOpen, onClose, drilling }: EditDrillingModalProps) => {
    const [formData, setFormData] = useState<DrillingInput>(initialFormState);
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    // Effect to populate form when drilling prop changes
    useEffect(() => {
        if (drilling) {
            console.log('Editing Drilling Object (JSON):', JSON.stringify(drilling, null, 2));

            // Attempt to find ID if standard 'id' is missing
            const inferredId = drilling.id || (drilling as any).drillingId;
            if (!inferredId) {
                console.error('Available keys on drilling object:', Object.keys(drilling));
            }

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: drilling.name || '',
                drillSize: drilling.drillSize || 0,
                depth: drilling.depth || 0,
                drillQuatities: drilling.drillQuatities || 0,
                priceMeter: drilling.priceMeter || 0,
                invoice: drilling.invoice || false,
                startDate: drilling.startDate ? drilling.startDate.split('T')[0] : '',
                endDate: drilling.endDate ? drilling.endDate.split('T')[0] : '',
                road: drilling.address?.road || '',
                // Try alternate field names for number and cep
                numberAddress: drilling.address?.number || (drilling.address as any)?.numberAddress || '',
                neighborhood: drilling.address?.neighborhood || '',
                city: drilling.address?.city || '',
                Cep: drilling.address?.Cep || (drilling.address as any)?.cep || '',
                condominiumBlock: drilling.address?.condominium?.Block || '',
                condominiumLot: drilling.address?.condominium?.Lot || '',
                ClientName: drilling.client?.name || '',
                Clientemail: drilling.client?.email || '',
                ClientPhone: drilling.client?.phone || '',
            });
        }
    }, [drilling]);

    const mutation = useMutation({
        mutationFn: (data: DrillingInput) => {
            const drillingId = drilling?.id || (drilling as any)?.drillingId;
            if (!drillingId) {
                throw new Error("Drilling ID is missing");
            }
            return drillingService.update(data, drillingId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drillings'] });
            onClose();
        },
        onError: (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Failed to update drilling:', err);
            setError(err.response?.data?.message || err.message || 'Falha ao atualizar serviço');
        },
    });

    const statusMutation = useMutation({
        mutationFn: ({ status, id }: { status: PaymentStatus, id: number }) => drillingService.changeStatus(status, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drillings'] });
            // We can optionally close the modal or just show success
            // onClose(); 
            // But usually for status change inside edit, we might want to stay open or strictly reflect the change.
            // Since the prop 'drilling' comes from parent which gets data from query, invalidating query should update props?
            // Actually 'drilling' prop is passed from selected state in parent. 
            // Parent needs to refetch to update its 'selectedDrilling' or we need to update local state?
            // The parent passes 'editingDrilling'. If we invalidate 'drillings', the parent list updates.
            // But 'editingDrilling' state in parent might be stale unless we update it or close modal.
            // Let's close modal for now to be safe, or we accept it updates the list behind.
            // User asked for "clicar me de uma lista...".
            onClose();
        },
        onError: (err: any) => {
            console.error('Failed to change status:', err);
            setError('Falha ao alterar status');
        }
    });

    const handleStatusChange = (status: PaymentStatus) => {
        if (drilling) {
            const drillingId = drilling.id || (drilling as any).drillingId;
            if (drillingId) {
                statusMutation.mutate({ status, id: drillingId });
            } else {
                setError("Não é possível alterar o status: ID do serviço não encontrado.");
            }
        }
    };

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
        if (drilling) {
            const drillingId = drilling.id || (drilling as any).drillingId;
            if (!drillingId) {
                setError("Não foi possível encontrar o ID para este serviço. Verifique o console para campos disponíveis.");
                return;
            }

            mutation.mutate(formData);
        }
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

                <h2 className="mb-6 text-xl font-bold text-gray-900">Editar Serviço de Perfuração</h2>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Reuse form fields from Creation Modal */}
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
                                id="edit-invoice"
                                checked={formData.invoice}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="edit-invoice" className="text-sm font-medium text-gray-700">Emitir Nota Fiscal</label>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Diâmetro Broca</label>
                            <input
                                type="number"
                                name="drillSize"
                                value={formData.drillSize}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profundidade (m)</label>
                            <input
                                type="number"
                                name="depth"
                                value={formData.depth}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                            <input
                                type="number"
                                name="drillQuatities"
                                value={formData.drillQuatities}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preço/m</label>
                            <input
                                type="number"
                                name="priceMeter"
                                value={formData.priceMeter}
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
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Status Financeiro</h3>
                        <div className="flex gap-4">
                            {(['PAGO', 'ATRASADO', 'NAO_PAGO'] as const).map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusChange(status)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${(drilling?.paymentsStatus === status)
                                        ? 'ring-2 ring-offset-2'
                                        : 'opacity-70 hover:opacity-100'
                                        } ${status === 'PAGO' ? 'bg-green-100 text-green-800 ring-green-500' :
                                            status === 'ATRASADO' ? 'bg-red-100 text-red-800 ring-red-500' :
                                                'bg-yellow-100 text-yellow-800 ring-yellow-500'
                                        }`}
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
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
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
