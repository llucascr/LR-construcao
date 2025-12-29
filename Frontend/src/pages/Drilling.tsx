import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { drillingService } from '../services/drillingService';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { CreateDrillingModal } from '../components/CreateDrillingModal';

export const Drilling = () => {
    const [page] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const pageSize = 10;

    const { data: drillings, isLoading, isError, error } = useQuery({
        queryKey: ['drillings', page],
        queryFn: () => drillingService.getAll(page, pageSize),
    });

    console.log('Drilling data:', drillings);

    const safeContent = drillings || [];


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('pt-BR').format(value);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Drilling Services</h1>
                    <p className="text-sm text-gray-500">Gerencie todas as perfurações e serviços</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                                            <div className="text-sm font-medium text-gray-900">{item.name || 'Sem nome'}</div>
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
                                            <a href="#" className="text-blue-600 hover:text-blue-900">
                                                Editar
                                            </a>
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
        </div>
    );
};
