export type PaymentStatus = 'PAGO' | 'NAO_PAGO' | 'ATRASADO';
export type BuildStatus = 'EM_ESPERA' | 'CONSTRUINDO' | 'CONCLUIDO';

export interface AccountCredentialsDTO {
    username?: string; // or email, based on your backend. The prompt says "credentials", typically username/email + password
    email?: string; // Supports both if needed, but usually one is the ID
    password?: string;
}

export interface TokenDTO {
    email: string;
    authenticated: boolean;
    created: string; // Date
    expiration: string; // Date
    accessToken: string;
    refreshToken: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string; // Optional for frontend display
    active: boolean;
    create_at: string; // ISO Date string
    update_at: string;
}

export interface Client {
    id: number;
    user_id: number; // Links to User who created/manages? Or the Client's user account? Based on schema "user_id (FK)", likely created_by.
    name: string;
    email: string;
    phone: string;
    create_at: string;
    update_at: string;
}

export interface ClientInput {
    name: string;
    email: string;
    phone: string;
}

export interface Condominium {
    id: number;
    Block: string;
    Lot: string;
}

export interface Address {
    id: number;
    road: string;
    number: string;
    neighborhood: string;
    city: string;
    Cep: string;
    condominium_id?: number | null;
    condominium?: Condominium; // Optional nested object if populated
}

export interface Drilling {
    id?: number;
    name: string;
    drillSize: number;
    depth: number;
    drillQuatities: number; // Backend typo: drillQuatities
    priceMeter: number;
    invoice: boolean;
    paymentsStatus: PaymentStatus;
    totalValue: number;
    startDate: string;
    endDate?: string;
    createAt: string;
    updateAt: string;
    address: Address;
    client: Client;
    user: User;
}

export interface Build {
    id: number;
    client_id: number;
    address_id: number;
    user_id: number;
    name: string;
    size: number; // size in meters?
    total_paid: number;
    total_qtd_payments: number;
    installments_value: number;
    status: BuildStatus;
    start_date: string;
    end_date?: string;
}

export interface DrillingInput {
    name: string;
    drillSize: number;
    depth: number;
    drillQuatities: number;
    priceMeter: number;
    invoice: boolean;
    // paymentsStatus default is used in backend
    startDate: string;
    endDate: string;

    // Address fields
    road: string;
    numberAddress: string;
    neighborhood: string;
    city: string;
    Cep: string;
    condominiumBlock: string;
    condominiumLot: string;

    // Client fields
    ClientName: string;
    Clientemail: string;
    ClientPhone: string;
}

export interface BuildResponseDTO {
    id: number;
    name: string;
    buildSize: number;
    totalPaid: number;
    buildCost: number; // Replaced qtdTotalPayments & paymentsValue
    status: BuildStatus;
    startDate: string;
    endDate: string;
    createAt: string;
    updateAt: string;
    address: Address;
    client: Client;
    user: User;
}

export interface BuildRequestDTO {
    name: string;
    buildSize: number;
    totalPaid: number;
    buildCost: number;
    startDate: string;
    endDate: string;

    // Flattened Address
    road: string;
    numberAddress: string;
    neighborhood: string;
    city: string;
    Cep: string;
    condominiumBlock: string;
    condominiumLot: string;

    // Flattened Client
    ClientName: string;
    Clientemail: string;
    ClientPhone: string;
}

// Create DTO is now identical to BuildRequestDTO
export type CreateBuildRequestDTO = BuildRequestDTO;

export interface TotalPaidResponseDTO {
    addedValue: number;
    totalPaid: number;
}
