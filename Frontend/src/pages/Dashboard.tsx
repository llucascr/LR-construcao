import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Hammer,
    HardHat,
    DollarSign,
    MoreVertical,
    ArrowRight,
    MapPin
} from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { clientService } from '../services/clientService';
import { formatPhoneNumber } from '../utils/formatters';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    // Queries
    const { data: totalDrilling } = useQuery({
        queryKey: ['dashboard', 'totalDrilling'],
        queryFn: dashboardService.getTotalDrillingMonth
    });

    const { data: monthlyRevenue } = useQuery({
        queryKey: ['dashboard', 'monthlyRevenue'],
        queryFn: dashboardService.getMonthlyRevenue
    });

    const { data: totalPaidBuild } = useQuery({
        queryKey: ['dashboard', 'totalPaidBuild'],
        queryFn: dashboardService.getTotalPaidBuildMonth
    });

    const { data: totalClients } = useQuery({
        queryKey: ['dashboard', 'totalClients'],
        queryFn: dashboardService.getTotalClients
    });

    const { data: clientsList } = useQuery({
        queryKey: ['dashboard', 'clientsList'],
        queryFn: () => clientService.getClients(0, 10)
    });

    const { data: recentDrillings } = useQuery({
        queryKey: ['dashboard', 'recentDrillings'],
        queryFn: dashboardService.findDrillingRecent
    });

    const { data: highlightBuild } = useQuery({
        queryKey: ['dashboard', 'highlightBuild'],
        queryFn: dashboardService.findBuildHighlight
    });

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined) return 'Carregando...';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Metrics Data
    const metrics = [
        {
            label: 'Perfurações (Mês)',
            value: totalDrilling?.toString() || '0',
            trend: '+20%', // Keeping mock trend for now as API doesn't provide it
            trendUp: true,
            icon: Hammer,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Faturamento Perfuração',
            value: formatCurrency(monthlyRevenue),
            trend: '+15%',
            trendUp: true,
            icon: DollarSign,
            color: 'bg-green-50 text-green-600'
        },
        {
            label: 'Faturamento Obras',
            value: formatCurrency(totalPaidBuild),
            trend: '+8%',
            trendUp: true,
            icon: HardHat,
            color: 'bg-orange-50 text-orange-600'
        },
        {
            label: 'Total Clientes',
            value: totalClients?.toString() || '0',
            trend: '+2 novos',
            trendUp: true,
            icon: Users,
            color: 'bg-purple-50 text-purple-600'
        }
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAGO': return 'bg-green-100 text-green-800';
            case 'ATRASADO': return 'bg-red-100 text-red-800';
            case 'NAO_PAGO': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PAGO': return 'PAGO';
            case 'ATRASADO': return 'ATRASADO';
            case 'NAO_PAGO': return 'NÃO PAGO';
            default: return status;
        }
    };

    const getBuildStatusLabel = (status: string) => {
        switch (status) {
            case 'PLANEJAMENTO': return 'Planejamento';
            case 'EM_ANDAMENTO': return 'Em Andamento';
            case 'EM_ACABAMENTO': return 'Em Acabamento';
            case 'CONCLUIDO': return 'Concluído';
            case 'PARALISADO': return 'Paralisado';
            default: return status;
        }
    };



    return (
        <div className="space-y-6 h-[calc(100vh-3rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
                <div className="text-sm text-gray-500">
                    Última atualização: Hoje, 10:30
                </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${metric.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {metric.trend}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{metric.label}</h3>
                            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Main Column */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-0">

                    {/* Featured Build Card */}
                    {highlightBuild && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <HardHat size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800">Obra em Destaque</h2>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                    Ver Detalhes <ArrowRight size={16} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Placeholder for build image/map */}
                                    <div className="w-full md:w-1/3 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                        <MapPin size={48} opacity={0.5} />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-xl font-bold text-gray-800">{highlightBuild.buildName}</h3>
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {getBuildStatusLabel(highlightBuild.statusBuild)}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                                <MapPin size={14} /> {highlightBuild.road}, {highlightBuild.numberAddress} - {highlightBuild.neighborhood}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progresso</span>
                                                <span className="font-bold text-gray-800">{highlightBuild.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${highlightBuild.progress}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 text-xs">Início</p>
                                                <p className="font-medium">{formatDate(highlightBuild.startDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Previsão</p>
                                                <p className="font-medium">{formatDate(highlightBuild.endDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Custo</p>
                                                <p className="font-medium text-green-600">{formatCurrency(highlightBuild.buildCost)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Drilling Table - adjusted to fit remaining space */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0">
                        <div className="p-6 border-b border-gray-100 shrink-0">
                            <h2 className="text-lg font-bold text-gray-800">Perfurações Recentes</h2>
                        </div>
                        <div className="overflow-hidden flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Cliente</th>
                                        <th className="px-6 py-3">Data</th>
                                        <th className="px-6 py-3">Metragem</th>
                                        <th className="px-6 py-3">Valor</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recentDrillings || []).map((drill) => (
                                        <tr key={drill.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{drill.clientName}</td>
                                            <td className="px-6 py-4">{formatDate(drill.startDate)}</td>
                                            <td className="px-6 py-4">{drill.depth}m</td>
                                            <td className="px-6 py-4">{formatCurrency(drill.totalValue)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(drill.paymentsStatus)}`}>
                                                    {getStatusLabel(drill.paymentsStatus)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="h-full min-h-0">

                    {/* Quick Clients */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Clientes Principais</h2>
                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
                        </div>
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                            {clientsList?.map((client) => (
                                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{client.name}</p>
                                            <p className="text-xs text-gray-500">{formatPhoneNumber(client.phone)}</p>
                                        </div>
                                    </div>
                                    {/* Removing projects count as it's not in the simple Client DTO */}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/clients')}
                            className="w-full mt-auto text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border-t pt-4"
                        >
                            Ver Todos os Clientes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
