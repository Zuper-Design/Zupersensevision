import { Check } from 'lucide-react';
import {
  JobCard,
  ProjectCard,
  CustomerCard,
  OrganizationCard,
  PropertyCard,
  VendorCard,
  MaterialRequestCard,
  PartsCard,
  ServicesCard,
  QuoteCard,
  InvoiceCard,
  ContractCard,
  AssetCard,
} from './cards';

interface CreatedCardDisplayProps {
  cardType: string;
  onClose: () => void;
}

// Mock data generators
const generateMockData = (type: string) => {
  switch (type.toLowerCase()) {
    case 'job':
      return {
        title: 'Roof Replacement - Residential',
        customer: 'John Smith',
        organization: undefined,
        scheduledDate: '2026-02-25',
        scheduledTime: '09:00 AM',
        technician: 'Mike Johnson',
        priority: 'High',
      };
    
    case 'project':
      return {
        projectName: 'Commercial Building Renovation',
        customer: 'ABC Corporation',
        organization: undefined,
        startDate: '2026-03-01',
        endDate: '2026-06-30',
        projectManager: 'Sarah Williams',
        status: 'Planning',
      };
    
    case 'customer':
      return {
        customerName: 'Emily Johnson',
        organization: undefined,
        phone: '(555) 123-4567',
        email: 'emily.j@example.com',
        serviceAddress: '123 Main Street, Springfield',
        customerType: 'Residential',
      };
    
    case 'organization':
      return {
        organizationName: 'Springfield Property Management',
        primaryContact: 'David Brown',
        email: 'david@springfield.com',
        phone: '(555) 987-6543',
        address: '456 Business Ave, Springfield',
        accountStatus: 'Active',
      };
    
    case 'property':
      return {
        propertyName: '789 Oak Street, Springfield',
        owner: 'Michael Chen',
        organization: undefined,
        propertyType: 'Commercial',
        accessNotes: 'Gate code: 1234. Contact security at entrance.',
        activeStatus: 'Active',
      };
    
    case 'vendor':
      return {
        vendorName: 'Superior Roofing Supplies',
        contactPerson: 'James Wilson',
        phone: '(555) 456-7890',
        email: 'james@superiorroofing.com',
        serviceCategory: 'Materials Supplier',
        vendorStatus: 'Preferred',
      };
    
    case 'material request':
      return {
        requestTitle: 'Asphalt Shingles - 20 Squares',
        requestedBy: 'Tom Anderson',
        relatedJobProject: 'Roof Replacement - Residential',
        priority: 'High',
        neededByDate: '2026-02-24',
        status: 'Pending',
      };
    
    case 'part':
      return {
        partName: 'Ridge Cap Shingles',
        skuCode: 'RCS-2024',
        category: 'Roofing Materials',
        stockQuantity: 50,
        reorderLevel: 10,
        unitCost: 28.50,
      };
    
    case 'service':
      return {
        serviceName: 'Emergency Roof Repair',
        category: 'Emergency Services',
        duration: '2-4 hours',
        price: 450,
        assignedTeamType: 'Emergency Response',
        availabilityStatus: 'Available',
      };
    
    case 'quote':
      return {
        quoteTitle: 'Q-2026-0215',
        customer: 'Jennifer Martinez',
        relatedJobProject: undefined,
        totalAmount: 8500,
        validUntil: '2026-03-20',
        status: 'Sent',
      };
    
    case 'invoice':
      return {
        invoiceNumber: 'INV-2026-0045',
        customer: 'Robert Taylor',
        relatedJobProject: undefined,
        amount: 3200,
        dueDate: '2026-03-15',
        paymentStatus: 'Pending',
      };
    
    case 'contract':
      return {
        contractName: 'Annual Maintenance Agreement',
        customerOrg: 'Tech Park Plaza',
        startDate: '2026-03-01',
        endDate: '2027-02-28',
        contractValue: 24000,
        status: 'Active',
      };
    
    case 'asset':
      return {
        assetName: 'Pneumatic Nail Gun Pro 3000',
        assetType: 'Power Tool',
        location: 'Main Warehouse',
        assignedTo: 'Crew Team A',
        serialNumber: 'PNG-3000-2024-0123',
        status: 'Active',
      };
    
    default:
      return {};
  }
};

export const CreatedCardDisplay = ({ cardType, onClose }: CreatedCardDisplayProps) => {
  const mockData = generateMockData(cardType);

  const renderCard = () => {
    switch (cardType.toLowerCase()) {
      case 'job':
        return <JobCard {...mockData as any} />;
      case 'project':
        return <ProjectCard {...mockData as any} />;
      case 'customer':
        return <CustomerCard {...mockData as any} />;
      case 'organization':
        return <OrganizationCard {...mockData as any} />;
      case 'property':
        return <PropertyCard {...mockData as any} />;
      case 'vendor':
        return <VendorCard {...mockData as any} />;
      case 'material request':
        return <MaterialRequestCard {...mockData as any} />;
      case 'part':
        return <PartsCard {...mockData as any} />;
      case 'service':
        return <ServicesCard {...mockData as any} />;
      case 'quote':
        return <QuoteCard {...mockData as any} />;
      case 'invoice':
        return <InvoiceCard {...mockData as any} />;
      case 'contract':
        return <ContractCard {...mockData as any} />;
      case 'asset':
        return <AssetCard {...mockData as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slideUp">
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
      
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E6E8EC] p-6 max-w-md">
        {/* Success Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-[#1C1E21]">
              {cardType.charAt(0).toUpperCase() + cardType.slice(1)} Created
            </h3>
            <p className="text-[13px] text-[#6B7280]">Successfully created new {cardType}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors"
          >
            Close
          </button>
        </div>

        {/* Card Preview */}
        <div className="bg-[#F8F9FB] rounded-xl p-4">
          {renderCard()}
        </div>
      </div>
    </div>
  );
};
