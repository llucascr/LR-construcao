import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, MapPin, Calendar, DollarSign, User, Edit2 } from 'lucide-react';
import { buildService } from '../services/buildService';
import type { BuildResponseDTO, BuildRequestDTO, BuildStatus, TotalPaidResponseDTO } from '../types';
import { CreateBuildModal } from '../components/CreateBuildModal';
import { AddPaymentModal } from '../components/AddPaymentModal';


export const Builds: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuild, setSelectedBuild] = useState<BuildResponseDTO | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form state for editing
    const [editFormData, setEditFormData] = useState<BuildRequestDTO | null>(null);
    const [editStatus, setEditStatus] = useState<BuildStatus>('EM_ESPERA'); // Separate status state
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handlePaymentSuccess = (data: TotalPaidResponseDTO) => {
        if (selectedBuild) {
            setSelectedBuild({
                ...selectedBuild,
                totalPaid: data.totalPaid
            });
        }
    };

    const openEditModal = (build: BuildResponseDTO) => {
        console.log("Opening edit modal with build:", build);
        // Flatten nested objects into the single DTO structure
        setEditFormData({
            name: build.name,
            buildSize: build.buildSize,
            totalPaid: build.totalPaid,
            buildCost: build.buildCost,
            startDate: build.startDate,
            endDate: build.endDate,

            // Flatten Address
            road: build.address.road,
            numberAddress: build.address.number, // Mapping 'number' to 'numberAddress'
            neighborhood: build.address.neighborhood,
            city: build.address.city,
            Cep: build.address.Cep,
            condominiumBlock: build.address.condominium?.Block || '',
            condominiumLot: build.address.condominium?.Lot || '',

            // Flatten Client
            ClientName: build.client.name,
            Clientemail: build.client.email,
            ClientPhone: build.client.phone
        });
        // Status is handled separately as it's not in the update DTO anymore (based on user snippet)
        // logic below uses 'statusToSend' which we might need to track separately if not in DTO?
        // Wait, where do we store status if not in editFormData?
        // The DTO doesn't have it, but we still want to update it.
        // We can keep it in a separate state or just pass it to the changeStatus call directly if we had a status selector.
        // But the form uses editFormData.status.
        // We should add 'status' to editFormData OR handle it separately. 
        // User snippet REMOVED status.
        // So I should either:
        // 1. Add status to DTO (violates user snippet strictness?)
        // 2. Use a separate state for status editing.
        // I'll stick to DTO strictness and use a separate state `editStatus` or just use `selectedBuild.status` as initial value and local state.
        // Actually, let's look at `handleEditSubmit`. It calls changeStatus.
        // I'll add `const [editStatus, setEditStatus] = useState<BuildStatus>('EM_ESPERA');`
        setEditStatus(build.status);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editFormData && selectedBuild) {
            try {
                // Formatting dates and sanitizing condo fields
                const submissionData = {
                    ...editFormData,
                    startDate: editFormData.startDate.includes('T') ? editFormData.startDate : `${editFormData.startDate}T00:00:00`,
                    endDate: editFormData.endDate.includes('T') ? editFormData.endDate : `${editFormData.endDate}T00:00:00`,
                    // Sanitize condo fields to avoid ORA-01400
                    condominiumBlock: editFormData.condominiumBlock.trim() === '' ? ' ' : editFormData.condominiumBlock,
                    condominiumLot: editFormData.condominiumLot.trim() === '' ? ' ' : editFormData.condominiumLot,
                };

                // Run sequentially
                try {
                    await buildService.update(submissionData, selectedBuild.id);
                } catch (updateError) {
                    console.error("Error in MAIN update:", updateError);
                    alert("Erro ao atualizar dados principais da obra. Verifique o console.");
                    return;
                }

                try {
                    await buildService.changeStatus(editStatus, selectedBuild.id);
                } catch (statusError) {
                    console.error("Error in STATUS update:", statusError);
                    alert("Dados salvos, mas erro ao atualizar status.");
                }

                setIsEditModalOpen(false);
                setSelectedBuild(null);
                window.location.reload();

            } catch (error) {
                console.error("Unexpected error updating build", error);
                alert("Erro inesperado ao atualizar obra");
            }
        }
    };


    const { data: builds, isLoading, error } = useQuery({
        queryKey: ['builds'],
        queryFn: () => buildService.getAll(0, 50), // Fetching more to show scrolling
    });

    const filteredBuilds = builds?.filter(build =>
        build.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        build.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    // ... (rest of helper functions)

    // ... (previous helpers)

    // ... (previous helpers)

    const formatStatus = (status: string) => {
        switch (status) {
            case 'EM_ESPERA': return 'EM ESPERA';
            case 'CONSTRUINDO': return 'CONSTRUINDO';
            case 'CONCLUIDO': return 'CONCLUÍDO';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONCLUIDO': return 'bg-green-100 text-green-800 border-green-200';
            case 'CONSTRUINDO': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'EM_ESPERA': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // ...

    // Update Build Card Rendering
    // Around line 135:
    // {formatStatus(build.status)}

    // Update Details Modal Rendering
    // Around line 201:
    // {formatStatus(selectedBuild.status)}

    // Details Modal Status Section Update
    // <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg"> ...
    // <span className={`text-lg font-bold ...`}>
    //     {formatStatus(selectedBuild.status)}
    // </span>


    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Carregando...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Erro ao carregar obras</div>;
    }

    return (
        <div className="p-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Serviços de Obras</h1>
                    <p className="text-sm text-gray-500">Gerencie todas as obras</p>
                </div>
                <div className="relative w-full md:w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar obras..."
                        className="pl-10 p-2.5 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    <span>Nova Obra</span>
                </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBuilds?.map((build, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-1 transition-all"
                        onClick={() => setSelectedBuild(build)}
                    >
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-gray-800" title={build.name}>
                                    {build.name}
                                </h3>
                                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold
                                    ${getStatusColor(build.status).replace('border', '')}`}>
                                    {formatStatus(build.status)}
                                </span>
                            </div>

                            <div className="space-y-4 text-base text-gray-600">
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-gray-400" />
                                    <span className="truncate font-medium">{build.client.name}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-gray-400 mt-1" />
                                    <span>
                                        {build.address ? `${build.address.road}, ${build.address.number}${build.address.neighborhood ? ` - ${build.address.neighborhood}` : ''}${build.address.city ? `, ${build.address.city}` : ''}` : 'Sem endereço'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign size={18} className="text-gray-400" />
                                    <span className="font-medium text-gray-900">{formatCurrency(build.buildCost)} custo</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-gray-400" />
                                    <span>{formatDate(build.startDate)} - {formatDate(build.endDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 mt-auto">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Tamanho: <span className="font-medium text-gray-700">{build.buildSize}m²</span></span>
                                <span>Atualizado: {formatDate(build.updateAt)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {
                filteredBuilds?.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        Nenhuma obra encontrada.
                    </div>
                )
            }

            {/* Build Details Modal */}
            {
                selectedBuild && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedBuild(null)}>
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">Detalhes da Obra</h2>
                                <button
                                    onClick={() => setSelectedBuild(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">

                                {/* Status Section */}
                                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm text-blue-600 font-semibold mb-1">Status Atual</p>
                                        <span className={`text-lg font-bold
                                    ${selectedBuild.status === 'CONCLUIDO' ? 'text-green-700' :
                                                selectedBuild.status === 'CONSTRUINDO' ? 'text-blue-700' :
                                                    'text-yellow-700'}`}>
                                            {formatStatus(selectedBuild.status)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-blue-600 font-semibold mb-1">Valor Pago</p>
                                        <p className="text-lg font-bold text-gray-800">{formatCurrency(selectedBuild.totalPaid)}</p>
                                        <p className="text-xs text-gray-500">de {formatCurrency(selectedBuild.buildCost)} total</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Build Info */}
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 pb-2 border-b">
                                            <div className="p-1.5 bg-gray-100 rounded-md"><User size={16} /></div>
                                            Dados da Obra
                                        </h3>
                                        <dl className="space-y-3 text-sm">
                                            <div>
                                                <dt className="text-gray-500 mb-1">Nome do Projeto</dt>
                                                <dd className="font-medium text-gray-900">{selectedBuild.name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500 mb-1">Tamanho</dt>
                                                <dd className="font-medium text-gray-900">{selectedBuild.buildSize} m²</dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500 mb-1">Período</dt>
                                                <dd className="font-medium text-gray-900">
                                                    {formatDate(selectedBuild.startDate)} até {formatDate(selectedBuild.endDate)}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Client Info */}
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 pb-2 border-b">
                                            <div className="p-1.5 bg-gray-100 rounded-md"><User size={16} /></div>
                                            Cliente
                                        </h3>
                                        <dl className="space-y-3 text-sm">
                                            <div>
                                                <dt className="text-gray-500 mb-1">Nome</dt>
                                                <dd className="font-medium text-gray-900">{selectedBuild.client.name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500 mb-1">Email</dt>
                                                <dd className="font-medium text-gray-900">{selectedBuild.client.email}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500 mb-1">Telefone</dt>
                                                <dd className="font-medium text-gray-900">{selectedBuild.client.phone}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* Address Info */}
                                <div>
                                    <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 pb-2 border-b">
                                        <div className="p-1.5 bg-gray-100 rounded-md"><MapPin size={16} /></div>
                                        Endereço
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                        <p className="font-medium text-gray-900 text-base mb-1">
                                            {selectedBuild.address.road}, {selectedBuild.address.number}
                                        </p>
                                        <p>{selectedBuild.address.neighborhood}</p>
                                        <div className="flex gap-4 mt-2">
                                            <span>{selectedBuild.address.city}</span>
                                            <span className="text-gray-400">|</span>
                                            <span>CEP: {selectedBuild.address.Cep}</span>
                                        </div>
                                        {selectedBuild.address.condominium && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <p><span className="font-medium">Bloco:</span> {selectedBuild.address.condominium.Block}</p>
                                                <p><span className="font-medium">Lote:</span> {selectedBuild.address.condominium.Lot}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <DollarSign size={16} />
                                    <span>Adicionar Pagamento</span>
                                </button>
                                <button
                                    onClick={() => openEditModal(selectedBuild)}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                    <span>Editar Obra</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Payment Modal */}
            {selectedBuild && (
                <AddPaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    buildId={selectedBuild.id}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editFormData && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Editar Obra</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto flex-1 space-y-8">

                            {/* Build Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                                    <div className="p-1.5 bg-gray-100 rounded-lg"><User size={18} /></div>
                                    Dados da Obra
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Obra</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.name}
                                            onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editStatus}
                                            onChange={e => setEditStatus(e.target.value as BuildStatus)}
                                        >
                                            <option value="EM_ESPERA">EM ESPERA</option>
                                            <option value="CONSTRUINDO">CONSTRUINDO</option>
                                            <option value="CONCLUIDO">CONCLUÍDO</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho (m²)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={editFormData.buildSize}
                                        onChange={e => setEditFormData({ ...editFormData, buildSize: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Custo da Obra</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={editFormData.buildCost}
                                        onChange={e => setEditFormData({ ...editFormData, buildCost: Number(e.target.value) })}
                                    />
                                </div>
                                {/* totalPaid is available for editing if needed */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total Pago</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={editFormData.totalPaid}
                                        onChange={e => setEditFormData({ ...editFormData, totalPaid: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                                    <input
                                        type="date"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={editFormData.startDate ? editFormData.startDate.split('T')[0] : ''}
                                        onChange={e => setEditFormData({ ...editFormData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Término</label>
                                    <input
                                        type="date"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={editFormData.endDate ? editFormData.endDate.split('T')[0] : ''}
                                        onChange={e => setEditFormData({ ...editFormData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Client Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                                    <div className="p-1.5 bg-gray-100 rounded-lg"><User size={18} /></div>
                                    Dados do Cliente
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.ClientName}
                                            onChange={e => setEditFormData({ ...editFormData, ClientName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.Clientemail}
                                            onChange={e => setEditFormData({ ...editFormData, Clientemail: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.ClientPhone}
                                            onChange={e => setEditFormData({ ...editFormData, ClientPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                                    <div className="p-1.5 bg-gray-100 rounded-lg"><MapPin size={18} /></div>
                                    Endereço
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.road}
                                            onChange={e => setEditFormData({ ...editFormData, road: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.numberAddress}
                                            onChange={e => setEditFormData({ ...editFormData, numberAddress: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.neighborhood}
                                            onChange={e => setEditFormData({ ...editFormData, neighborhood: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.city}
                                            onChange={e => setEditFormData({ ...editFormData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editFormData.Cep}
                                            onChange={e => setEditFormData({ ...editFormData, Cep: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }

            <CreateBuildModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

        </div >
    );
};
