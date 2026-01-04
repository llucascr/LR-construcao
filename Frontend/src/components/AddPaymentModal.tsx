import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, AlertCircle } from 'lucide-react';
import { buildService } from '../services/buildService';
import type { TotalPaidResponseDTO } from '../types';

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    buildId: number;
    onSuccess: (data: TotalPaidResponseDTO) => void;
}

export const AddPaymentModal = ({ isOpen, onClose, buildId, onSuccess }: AddPaymentModalProps) => {
    const [paymentValue, setPaymentValue] = useState<string>(''); // Keep as string for better input handling
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (amount: number) => buildService.addPayment(amount, buildId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['builds'] });
            onSuccess(data);
            setPaymentValue('');
            onClose();
        },
        onError: (err: any) => {
            console.error('Failed to add payment:', err);
            setError(err.response?.data?.message || err.message || 'Failed to add payment');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const amount = parseFloat(paymentValue);
        if (isNaN(amount) || amount <= 0) {
            setError('Por favor, insira um valor de pagamento válido maior que 0');
            return;
        }

        mutation.mutate(amount);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-6 text-xl font-bold text-gray-900">Adicionar Pagamento</h2>

                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valor do Pagamento</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                            <input
                                type="number"
                                required
                                value={paymentValue}
                                onChange={(e) => setPaymentValue(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 pl-10 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0,00"
                                step="any"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
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
                            className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {mutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
