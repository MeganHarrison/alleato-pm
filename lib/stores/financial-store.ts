import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Commitment, 
  ChangeEvent, 
  PrimeContract, 
  Invoice, 
  BudgetItem,
  Company 
} from '@/types/financial';

interface FinancialState {
  // State
  commitments: Commitment[];
  changeEvents: ChangeEvent[];
  primeContracts: PrimeContract[];
  invoices: Invoice[];
  budgetItems: BudgetItem[];
  companies: Company[];
  
  // Loading states
  isLoading: {
    commitments: boolean;
    changeEvents: boolean;
    primeContracts: boolean;
    invoices: boolean;
    budgetItems: boolean;
    companies: boolean;
  };
  
  // Error states
  errors: {
    commitments: string | null;
    changeEvents: string | null;
    primeContracts: string | null;
    invoices: string | null;
    budgetItems: string | null;
    companies: string | null;
  };
  
  // Actions
  setCommitments: (commitments: Commitment[]) => void;
  addCommitment: (commitment: Commitment) => void;
  updateCommitment: (id: string, commitment: Partial<Commitment>) => void;
  deleteCommitment: (id: string) => void;
  
  setChangeEvents: (changeEvents: ChangeEvent[]) => void;
  addChangeEvent: (changeEvent: ChangeEvent) => void;
  updateChangeEvent: (id: string, changeEvent: Partial<ChangeEvent>) => void;
  deleteChangeEvent: (id: string) => void;
  
  setPrimeContracts: (primeContracts: PrimeContract[]) => void;
  addPrimeContract: (primeContract: PrimeContract) => void;
  updatePrimeContract: (id: string, primeContract: Partial<PrimeContract>) => void;
  deletePrimeContract: (id: string) => void;
  
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  setBudgetItems: (budgetItems: BudgetItem[]) => void;
  updateBudgetItem: (id: string, budgetItem: Partial<BudgetItem>) => void;
  
  setCompanies: (companies: Company[]) => void;
  addCompany: (company: Company) => void;
  
  setLoading: (module: keyof FinancialState['isLoading'], loading: boolean) => void;
  setError: (module: keyof FinancialState['errors'], error: string | null) => void;
}

export const useFinancialStore = create<FinancialState>()(
  devtools(
    (set) => ({
      // Initial state
      commitments: [],
      changeEvents: [],
      primeContracts: [],
      invoices: [],
      budgetItems: [],
      companies: [],
      
      isLoading: {
        commitments: false,
        changeEvents: false,
        primeContracts: false,
        invoices: false,
        budgetItems: false,
        companies: false,
      },
      
      errors: {
        commitments: null,
        changeEvents: null,
        primeContracts: null,
        invoices: null,
        budgetItems: null,
        companies: null,
      },
      
      // Actions
      setCommitments: (commitments) => set({ commitments }),
      addCommitment: (commitment) => 
        set((state) => ({ commitments: [...state.commitments, commitment] })),
      updateCommitment: (id, commitment) =>
        set((state) => ({
          commitments: state.commitments.map((c) =>
            c.id === id ? { ...c, ...commitment } : c
          ),
        })),
      deleteCommitment: (id) =>
        set((state) => ({
          commitments: state.commitments.filter((c) => c.id !== id),
        })),
      
      setChangeEvents: (changeEvents) => set({ changeEvents }),
      addChangeEvent: (changeEvent) =>
        set((state) => ({ changeEvents: [...state.changeEvents, changeEvent] })),
      updateChangeEvent: (id, changeEvent) =>
        set((state) => ({
          changeEvents: state.changeEvents.map((ce) =>
            ce.id === id ? { ...ce, ...changeEvent } : ce
          ),
        })),
      deleteChangeEvent: (id) =>
        set((state) => ({
          changeEvents: state.changeEvents.filter((ce) => ce.id !== id),
        })),
      
      setPrimeContracts: (primeContracts) => set({ primeContracts }),
      addPrimeContract: (primeContract) =>
        set((state) => ({ primeContracts: [...state.primeContracts, primeContract] })),
      updatePrimeContract: (id, primeContract) =>
        set((state) => ({
          primeContracts: state.primeContracts.map((pc) =>
            pc.id === id ? { ...pc, ...primeContract } : pc
          ),
        })),
      deletePrimeContract: (id) =>
        set((state) => ({
          primeContracts: state.primeContracts.filter((pc) => pc.id !== id),
        })),
      
      setInvoices: (invoices) => set({ invoices }),
      addInvoice: (invoice) =>
        set((state) => ({ invoices: [...state.invoices, invoice] })),
      updateInvoice: (id, invoice) =>
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id ? { ...i, ...invoice } : i
          ),
        })),
      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((i) => i.id !== id),
        })),
      
      setBudgetItems: (budgetItems) => set({ budgetItems }),
      updateBudgetItem: (id, budgetItem) =>
        set((state) => ({
          budgetItems: state.budgetItems.map((bi) =>
            bi.id === id ? { ...bi, ...budgetItem } : bi
          ),
        })),
      
      setCompanies: (companies) => set({ companies }),
      addCompany: (company) =>
        set((state) => ({ companies: [...state.companies, company] })),
      
      setLoading: (module, loading) =>
        set((state) => ({
          isLoading: { ...state.isLoading, [module]: loading },
        })),
      
      setError: (module, error) =>
        set((state) => ({
          errors: { ...state.errors, [module]: error },
        })),
    }),
    {
      name: 'financial-store',
    }
  )
);