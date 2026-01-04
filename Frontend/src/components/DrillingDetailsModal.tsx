import { X } from 'lucide-react';
import type { Drilling } from '../types';

interface DrillingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    drilling: Drilling | null;
}

export const DrillingDetailsModal = ({ isOpen, onClose, drilling }: DrillingDetailsModalProps) => {
    if (!isOpen || !drilling) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-6 text-xl font-bold text-gray-900 border-b pb-2">Detalhes do Serviço</h2>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Serviço</p>
                            <p className="text-lg font-semibold text-gray-900">{drilling.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Status Financeiro</p>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${drilling.paymentsStatus === 'PAGO' ? 'bg-green-100 text-green-800' :
                                drilling.paymentsStatus === 'ATRASADO' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {drilling.paymentsStatus === 'PAGO' ? 'PAGO' :
                                    drilling.paymentsStatus === 'ATRASADO' ? 'ATRASADO' : 'NÃO PAGO'}
                            </span>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 p-2 rounded">Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nome</p>
                                <p className="text-base text-gray-900">{drilling.client?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-base text-gray-900">{drilling.client?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Telefone</p>
                                <p className="text-base text-gray-900">{drilling.client?.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Info */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 p-2 rounded">Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-500">Rua</p>
                                <p className="text-base text-gray-900">{drilling.address?.road || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Número</p>
                                {/* Fallback for potential naming issues as seen in Edit modal */}
                                <p className="text-base text-gray-900">
                                    {drilling.address?.number || (drilling.address as any)?.numberAddress || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">CEP</p>
                                <p className="text-base text-gray-900">
                                    {drilling.address?.Cep || (drilling.address as any)?.cep || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Bairro</p>
                                <p className="text-base text-gray-900">{drilling.address?.neighborhood || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Cidade</p>
                                <p className="text-base text-gray-900">{drilling.address?.city || 'N/A'}</p>
                            </div>
                            {drilling.address?.condominium && (
                                <>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Condomínio Bloco</p>
                                        <p className="text-base text-gray-900">{drilling.address.condominium.Block || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Condomínio Lote</p>
                                        <p className="text-base text-gray-900">{drilling.address.condominium.Lot || 'N/A'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Technical Info */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 p-2 rounded">Dados Técnicos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Diâmetro Broca</p>
                                <p className="text-base text-gray-900">{drilling.drillSize} mm</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Profundidade</p>
                                <p className="text-base text-gray-900">{drilling.depth} m</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Quantidade</p>
                                <p className="text-base text-gray-900">{drilling.drillQuatities}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Preço/m</p>
                                <p className="text-base text-gray-900">R$ {drilling.priceMeter}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
