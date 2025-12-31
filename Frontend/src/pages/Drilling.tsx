import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { drillingService } from '../services/drillingService';
import { Loader2, AlertCircle, FileText, Search } from 'lucide-react';
import { CreateDrillingModal } from '../components/CreateDrillingModal';
import { EditDrillingModal } from '../components/EditDrillingModal';
import { DrillingDetailsModal } from '../components/DrillingDetailsModal';
import type { Drilling as DrillingType } from '../types';

export const Drilling = () => {
    const [page] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingDrilling, setEditingDrilling] = useState<DrillingType | null>(null);
    const [selectedDrilling, setSelectedDrilling] = useState<DrillingType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 10;

    const { data: drillings, isLoading, isError, error } = useQuery({
        queryKey: ['drillings', page],
        queryFn: () => drillingService.getAll(page, pageSize),
    });

    if (isError) {
        console.error('Error loading drillings:', error);
    }

    // Handle both array and Page response structures
    const allDrillings: DrillingType[] = Array.isArray(drillings) ? drillings : (drillings?.content || []);

    const safeContent = allDrillings.filter(drill => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();

        const searchFields = [
            drill.name,
            drill.address?.road,
            drill.address?.neighborhood,
            drill.address?.city,
            drill.address?.condominium?.block,
            drill.address?.condominium?.lot
        ];

        return searchFields.some(field => field && field.toLowerCase().includes(lowerTerm));
    });


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('pt-BR').format(value);
    };

    const handleEdit = (drilling: DrillingType) => {
        setEditingDrilling(drilling);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center text-red-500">
                <AlertCircle className="mb-2 h-10 w-10" />
                <p className="text-lg font-medium">Erro ao carregar serviços de perfuração</p>
                <p className="text-sm text-gray-500">{(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Drilling Services</h1>
                    <p className="text-sm text-gray-500">Gerencie todas as perfurações e serviços</p>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md mx-4">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                >
                    Novo Serviço
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Nome
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Drill Size
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Depth
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Quantities
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Price/m
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Total Value
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {safeContent.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                        <p>Nenhum serviço encontrado</p>
                                    </td>
                                </tr>
                            ) : (
                                safeContent.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedDrilling(item)}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                                >
                                                    {item.name || 'Sem nome'}
                                                </button>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.paymentsStatus === 'PAGO' ? 'bg-green-100 text-green-800' :
                                                    item.paymentsStatus === 'ATRASADO' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {item.paymentsStatus === 'PAGO' ? 'PAGO' :
                                                        item.paymentsStatus === 'ATRASADO' ? 'ATRASADO' : 'NÃO PAGO'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {/* Assuming size is in some unit, keeping it simple */}
                                            {formatNumber(item.drillSize)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {formatNumber(item.depth)}m
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {formatNumber(item.drillQuatities)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {formatCurrency(item.priceMeter)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {formatCurrency(item.totalValue)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-900 focus:outline-none"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Removed as API returns complete list */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                    <p className="text-sm text-gray-500">Mostrando {safeContent.length} resultados</p>
                </div>
            </div>

            <CreateDrillingModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <EditDrillingModal
                isOpen={!!editingDrilling}
                onClose={() => setEditingDrilling(null)}
                drilling={editingDrilling}
            />
            <DrillingDetailsModal
                isOpen={!!selectedDrilling}
                onClose={() => setSelectedDrilling(null)}
                drilling={selectedDrilling}
            />
        </div>
    );
};
